import type { TOC } from "@ember/component/template-only";

/**
 * A fixed zone, so that the build and the browser agree on the day.
 *
 * Posts are dated in Eastern time.
 */
const format = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "America/New_York",
});

const iso = (date: string) => new Date(date).toISOString();
const long = (date: string) => format.format(new Date(date));

export const PostDate: TOC<{ Args: { date: string } }> = <template>
  <time datetime={{iso @date}}>{{long @date}}</time>
</template>;
