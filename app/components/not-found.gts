import { LinkTo } from "@ember/routing";

import { pageTitle } from "ember-page-title";

export const NotFound = <template>
  {{pageTitle "Not found"}}

  <h1>Not found</h1>
  <p>This strain went extinct. <LinkTo @route="index">See all posts</LinkTo>.</p>
</template>;
