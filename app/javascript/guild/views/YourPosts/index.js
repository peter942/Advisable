import React from "react";
import { useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import Loading from "@advisable-main/components/Loading";
import { Text } from "@advisable/donut";
import { GuildBox } from "@guild/styles";
import Post from "@guild/components/Post";
import { GUILD_YOUR_POSTS_QUERY } from "./queries";
import Filters from "@guild/components/Filters";
import { cursorLoadMore } from "@guild/utils";
import { StyledYourPost, StyledStatus } from "./styles";

const YourPosts = () => {
  const history = useHistory();
  const { data, loading, fetchMore } = useQuery(GUILD_YOUR_POSTS_QUERY, {
    fetchPolicy: "network-only",
  });

  useBottomScrollListener(() => {
    fetchMore &&
      cursorLoadMore({
        data,
        fetchMore,
        collectionKey: "guildYourPosts",
      });
  });

  const handleEdit = (postId) => history.push(`composer/${postId}/edit`);

  return loading ? (
    <Loading />
  ) : (
    <GuildBox
      margin="0 auto"
      mt="2xl"
      width={{ _: "100%", s: "85%", l: "70%" }}
      p={{ _: "s", s: "l" }}
    >
      <GuildBox spaceChildrenVertical={48}>
        <Filters yourPosts />
        {data &&
          data.guildYourPosts.nodes.map((post, key) => (
            <GuildBox key={key} position="relative">
              <StyledStatus onClick={() => handleEdit(post.id)}>
                {post.status === "draft" ? "Edit Draft" : "Edit"}
              </StyledStatus>
              <StyledYourPost draft={post.status === "draft"}>
                <Post post={post} />
              </StyledYourPost>
            </GuildBox>
          ))}
        {!loading && !data?.guildYourPosts?.nodes?.length && (
          <GuildBox
            background="white"
            spaceChildrenVertical={16}
            flexCenterBoth
            p="3xl"
          >
            <Text
              fontSize="xl"
              fontWeight="medium"
              letterSpacing="-0.01em"
              color="catalinaBlue100"
            >
              No Results
            </Text>
          </GuildBox>
        )}
      </GuildBox>
    </GuildBox>
  );
};

export default YourPosts;
