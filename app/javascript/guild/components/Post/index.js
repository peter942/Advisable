import React from "react";
import * as Sentry from "@sentry/react";
import { Pin } from "@styled-icons/ionicons-solid";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { Box, Card, Text, Avatar, Link, Notice } from "@advisable/donut";
import Topics from "./components/Topics";
import Markdown from "../Markdown";
import PostTypeTag from "@guild/components/PostTypeTag";
import PostActions from "@guild/components/PostActions";
import { CoverImage } from "@guild/components/CoverImage";
import ConnectionsCount from "@guild/components/ConnectionsCount";
import ResolvedNotice from "./components/ResolvedNotice";

const Post = ({
  post,
  showEdit = false,
  showShare = false,
  showDelete = false,
  showResolve = false,
  walkthrough = false,
}) => {
  const isGuildPath = /^\/guild/.test(window.location.pathname);
  const fullGuildPath = `/guild/posts/${post.id}`;
  const url = isGuildPath ? `/posts/${post.id}` : fullGuildPath;

  const history = useHistory();
  const handleOpen = () => {
    // We need to use an actual page load while the guild pack is separate.
    isGuildPath ? history.push(url) : (window.location = url);
  };

  const LinkOrExternal = isGuildPath ? RouterLink : Link.External;

  return (
    <Sentry.ErrorBoundary>
      <Card
        position="relative"
        padding={[4, 8]}
        borderRadius="12px"
        width="100%"
        border="2px solid"
        borderColor={post.pinned ? "neutral400" : "white"}
      >
        <Box position="absolute" right="4" top="4">
          <PostTypeTag post={post} />
        </Box>

        <Box display="flex" marginBottom="5" alignItems="center">
          <Avatar
            as={RouterLink}
            to={`/freelancers/${post.author.id}/guild`}
            size="s"
            name={post.author.name}
            url={post.author.avatar}
          />
          <Box ml="3">
            <Link
              mb={0.5}
              variant="dark"
              fontSize={["m", "l"]}
              color="neutral900"
              letterSpacing="-0.01rem"
              to={`/freelancers/${post.author.id}/guild`}
            >
              {post.author.name}
            </Link>
            <Text fontSize="xs" letterSpacing="-0.01rem" color="neutral600">
              {post.createdAtTimeAgo} ago
            </Text>
          </Box>
        </Box>

        {post.coverImage && (
          <Box mb="6">
            <a href={fullGuildPath}>
              <CoverImage
                height={{ _: "200px", s: "320px" }}
                cover={post.coverImage.url}
              />
            </a>
          </Box>
        )}

        <Text
          pb={4}
          display="block"
          fontSize={["2xl", "4xl"]}
          color="neutral900"
          fontWeight="medium"
          letterSpacing="-0.03rem"
          as={LinkOrExternal}
          to={url}
          href={url}
        >
          {post.title}
        </Text>

        <Box mb={6} onClick={handleOpen} style={{ cursor: "pointer" }}>
          <Markdown>{post.excerpt}</Markdown>
        </Box>

        <Text
          mb={6}
          display="inline-block"
          color="blue700"
          as={LinkOrExternal}
          href={url}
          to={url}
        >
          Read more
        </Text>

        {post.resolved ? (
          <ResolvedNotice authorName={post.author.firstName} />
        ) : (
          <Box display="flex" alignItems="center" marginBottom={5}>
            <PostActions
              mr={3}
              post={post}
              showEdit={showEdit}
              showShare={showShare}
              showDelete={showDelete}
              showResolve={showResolve}
              walkthrough={walkthrough}
            />
            <ConnectionsCount post={post} />
          </Box>
        )}

        <Topics topics={post.guildTopics} />

        {post.pinned && (
          <Notice mt={4} icon={<Pin />} padding={3} variant="orange">
            This post has been pinned by the Advisable team
          </Notice>
        )}
      </Card>
    </Sentry.ErrorBoundary>
  );
};

export default Post;
