import { on } from "@ember/modifier";
import { htmlSafe } from "@ember/template";

import type { TOC } from "@ember/component/template-only";

async function copyCode(event: Event) {
  const button = (event.target as Element).closest("button.copy");
  const code = button?.parentElement?.querySelector("pre")?.textContent;

  if (!button || !code) return;

  await navigator.clipboard.writeText(code);
  button.textContent = "Copied";
}

export const Prose: TOC<{ Args: { html: string } }> = <template>
  {{! template-lint-disable no-invalid-interactive }}
  <div class="prose" {{on "click" copyCode}}>
    {{htmlSafe @html}}
  </div>
</template>;
