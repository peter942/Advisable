import React, { useEffect, useMemo, useReducer, useRef } from "react";
import { Box } from "@advisable/donut";
import createDispatcher from "src/utilities/createDispatcher";
import { isEmpty, maxBy, minBy, sumBy } from "lodash-es";
import useResponsiveRef from "./useResponsiveRef";

const handleSectionParams = (state, sectionName, params) => {
  const maxWidth = maxBy(params, "width");
  const minWidth = minBy(params, "width");
  const maxHeight = maxBy(params, "height");
  const minHeight = minBy(params, "height");
  const sumWidth = sumBy(params, "width");
  const sumHeight = sumBy(params, "height");
  const area = sumHeight * sumWidth;
  console.log("area", area);
  return {
    ...state,
    sections: {
      ...state.sections,
      [sectionName]: {
        maxWidth,
        minWidth,
        maxHeight,
        minHeight,
        sumWidth,
        sumHeight,
        area,
        list: params,
      },
    },
  };
};

const setSectionsRatio = (state) => {
  const sectionKeys = Object.keys(state.sections);
  const ratioExist = sectionKeys.every((key) => state.sections[key].ratio);
  if (ratioExist) return state;
  const sectionsArea = sumBy(sectionKeys, (key) => state.sections[key].area);
  const percent = sectionsArea / 100;
  const sectionsWithRatio = sectionKeys.reduce((acc, key) => {
    // Calc and set ratio to each section
    const ratio = acc[key].area / percent;
    return { ...acc, [key]: { ...acc[key], ratio } };
  }, state.sections);
  console.log("sections with ratio", sectionsWithRatio);
  return { ...state, sections: sectionsWithRatio };
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_WRAPPER_WIDTH":
      console.log("set wrapper width", action);
      return { ...state, wrapperWidth: action.payload };
    case "SET_SECTIONS_RATIO":
      return setSectionsRatio(state);
    case "ADD_SECTION_PARAMS":
      return handleSectionParams(
        state,
        action.payload.sectionName,
        action.payload.sectionParams,
      );
    default:
      return state;
  }
};

function Filter(props) {
  const [state, dispatch] = useReducer(reducer, {
    sections: {},
  });
  // const filterWrapperRef = useRef(null);

  // Actions
  const createAction = useMemo(() => createDispatcher(dispatch), []);
  const addSectionParams = useMemo(() => createAction("ADD_SECTION_PARAMS"), [
    createAction,
  ]);
  const setWrapperWidth = useMemo(() => createAction("SET_WRAPPER_WIDTH"), [
    createAction,
  ]);
  const setSectionsRatio = useMemo(() => createAction("SET_SECTIONS_RATIO"), [
    createAction,
  ]);
  const [layoutRef, layoutWrapperWidth] = useResponsiveRef(setWrapperWidth);

  console.log("layout wrapper width", layoutWrapperWidth);
  // Set ratio of sections
  useEffect(() => {
    !isEmpty(state.sections) && setSectionsRatio({});
  }, [setSectionsRatio, state.sections]);

  const numOfSections = Object.keys(state.sections).length;
  console.log("num of sections", numOfSections);

  const tags = useMemo(
    () =>
      React.Children.map(props.children, (child) =>
        React.cloneElement(child, {
          ...child.props,
          addSectionParams,
          wrapperWidth: state.wrapperWidth,
          ratio: state.sections[child.props.sectionName]?.ratio,
        }),
      ),
    [addSectionParams, props.children, state.sections, state.wrapperWidth],
  );

  return (
    <Box ref={layoutRef} display="flex">
      {tags}
    </Box>
  );
}

export default Filter;
