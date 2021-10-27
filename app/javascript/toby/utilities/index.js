import { useEffect, useState, useCallback } from "react";
import pluralize from "pluralize";
import { gql } from "@apollo/client";
import { useLazyQuery, useApolloClient } from "@apollo/client";
import { jsonToGraphQLQuery, VariableType } from "json-to-graphql-query";
import { useSchema } from "../components/schema";

export function pluralizeType(type) {
  return pluralize(type.toLowerCase());
}

function generateSearchQuery(resource) {
  const queryObject = {
    query: {
      __name: `Toby_${resource.queryNameSearch}`,
      __variables: {
        query: "String!",
      },
      records: {
        __args: {
          query: new VariableType("query"),
          first: 10,
        },
        __aliasFor: resource.queryNameSearch,
        nodes: {
          id: true,
          _label: true,
        },
      },
    },
  };

  return gql(jsonToGraphQLQuery(queryObject));
}

export function useSearchResource(resource) {
  const client = useApolloClient();
  const query = generateSearchQuery(resource);

  const handleSearch = useCallback(
    (search) => {
      return client.query({
        query,
        variables: {
          query: search,
        },
      });
    },
    [client, query],
  );

  return handleSearch;
}

export function useFetchResources(resource, filters, sortBy, sortOrder) {
  const [loading, setLoading] = useState(true);
  const schemaData = useSchema();
  const query = generateCollectionQuery(schemaData, resource);
  const [fetch, { fetchMore, ...queryState }] = useLazyQuery(query, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    onCompleted() {
      setLoading(false);
    },
  });

  const fetchRecords = useCallback(
    async function fetchRecords() {
      fetch({
        variables: { filters, sortBy, sortOrder },
      });
    },
    [fetch, filters, sortBy, sortOrder],
  );

  const fetchMoreRecords = useCallback(
    (opts) => {
      setLoading(true);
      return fetchMore(opts);
    },
    [fetchMore],
  );

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return {
    ...queryState,
    fetchMore: fetchMoreRecords,
    loading,
  };
}

// Generates a graphql a collection query for a resource
export function generateCollectionQuery(schemaData, resourceData) {
  const node = {
    _label: true,
  };
  resourceData.attributes.forEach((attr) => {
    node[attr.name] = selectionForField(schemaData, resourceData, attr.name);
  });

  const queryObject = {
    query: {
      __name: `Toby_${resourceData.queryNameCollection}`,
      __variables: {
        cursor: "String",
        filters: "[FilterInput!]",
        sortBy: "String",
        sortOrder: "String",
      },
      records: {
        __args: {
          first: 100,
          after: new VariableType("cursor"),
          filters: new VariableType("filters"),
          sortBy: new VariableType("sortBy"),
          sortOrder: new VariableType("sortOrder"),
        },
        __aliasFor: resourceData.queryNameCollection,
        pageInfo: {
          hasNextPage: true,
          endCursor: true,
        },
        edges: {
          node,
        },
      },
    },
  };

  return gql(jsonToGraphQLQuery(queryObject));
}

const versionHistoryFields = {
  _history: {
    number: true,
    createdAt: true,
    responsible: true,
    changes: {
      attribute: true,
      value: true,
    },
  },
};

export function generateShowQuery(schemaData, resourceData) {
  const node = {
    _label: true,
  };
  resourceData.attributes.forEach((attr) => {
    node[attr.name] = selectionForField(schemaData, resourceData, attr.name);
  });

  const queryObject = {
    query: {
      __name: `Toby_${resourceData.queryNameItem}`,
      __variables: {
        id: "ID!",
      },
      record: {
        __args: {
          id: new VariableType("id"),
        },
        __aliasFor: resourceData.queryNameItem,
        ...node,
        ...versionHistoryFields,
        _actions: {
          name: true,
          label: true,
        },
      },
    },
  };

  const queryString = jsonToGraphQLQuery(queryObject);
  return gql(queryString);
}

export function generateUpdateMutation(schemaData, resourceData) {
  const node = {};
  resourceData.attributes.forEach((attr) => {
    node[attr.name] = selectionForField(schemaData, resourceData, attr.name);
  });

  const queryObject = {
    mutation: {
      __name: `Toby_${resourceData.queryNameUpdate}`,
      __variables: {
        id: "ID!",
        attributes: `${resourceData.type}Attributes!`,
      },
      update: {
        __args: {
          id: new VariableType("id"),
          attributes: new VariableType("attributes"),
        },
        __aliasFor: resourceData.queryNameUpdate,
        resource: {
          ...node,
          ...versionHistoryFields,
        },
      },
    },
  };

  const queryString = jsonToGraphQLQuery(queryObject);
  return gql(queryString);
}

export function generateActionMutation(schemaData, resourceData) {
  const node = {};
  resourceData.attributes.forEach((attr) => {
    node[attr.name] = selectionForField(schemaData, resourceData, attr.name);
  });

  const queryObject = {
    mutation: {
      __name: `Toby_${resourceData.type}_action`,
      __variables: {
        id: "ID!",
        name: "String!",
      },
      action: {
        __args: {
          id: new VariableType("id"),
          name: new VariableType("name"),
        },
        __aliasFor: `action${resourceData.type}`,
        url: true,
        resource: {
          ...node,
          ...versionHistoryFields,
          _actions: {
            name: true,
            label: true,
          },
        },
      },
    },
  };

  const queryString = jsonToGraphQLQuery(queryObject);
  return gql(queryString);
}

export function getType(schema, type) {
  return schema.types.find((t) => t.name === type);
}

export function resourceByType(schemaData, type) {
  return schemaData.resources.find((r) => r.type === type);
}

export function resourceAttribute(resourceData, attributeName) {
  return resourceData.attributes.find((a) => a.name === attributeName);
}

// takes a resource and attributeName and returns the nested resource
export function getNestedResource(schemadata, resource, attributeName) {
  const type = getType(schemadata.schema, resource.type);
  const field = type.fields.find((f) => f.name === attributeName);

  if (field.type.kind === "LIST") {
    return resourceByType(schemadata, field.type.ofType.ofType.name);
  }

  return resourceByType(schemadata, field.type.name);
}

// Returns the query selection for a given field. If the field is a scalar type
// we just return true which the json-to-graphql package will use to query for.
function selectionForField(schemaData, resourceData, fieldName) {
  const type = getType(schemaData.schema, resourceData.type);
  const field = type.fields.find((f) => f.name === fieldName);
  // if its a scalar type just return true
  if (field.type.kind === "SCALAR") return true;

  // handle special case when we might have a list of SCALAR types
  if (field.type.kind === "LIST") {
    if (field.type.ofType.ofType?.kind === "SCALAR") {
      return true;
    }
  }

  return {
    id: true,
    _label: true,
  };
}

export function resourcePath(resource) {
  return `/${pluralizeType(resource.type)}`;
}

export function recordPath(record) {
  return `/${pluralizeType(record.__typename)}/${record.id}`;
}
