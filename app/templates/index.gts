import { posts } from "#app/content.ts";
import { Head } from "#components/head.gts";
import { PostList } from "#components/post-list.gts";
import site from "#site";

<template>
  <Head @path="/" />

  <h1 class="site-description">{{site.description}}</h1>

  <PostList @posts={{posts}} />
</template>
