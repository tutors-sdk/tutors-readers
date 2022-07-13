<script lang="ts">
  import type { Topic } from "tutors-reader-lib/src/models/topic";
  import Icon from "tutors-reader-lib/src/iconography/Icon.svelte";
  import {convertMd} from "tutors-reader-lib/src/utils/markdown-utils";

  export let topic: Topic;

  let orderedLos = topic.toc.filter((lo) => lo?.frontMatter?.order);
  let unOrderedLos = topic.toc.filter((lo) => !(lo?.frontMatter?.order));
  orderedLos.sort((a, b) => a.frontMatter.order - b.frontMatter.order);
  orderedLos.push(...unOrderedLos);
  topic.toc = orderedLos;
</script>

{#each topic.toc as lo}
  <div>
    <a href={lo.route} class="flex">
      <Icon type="{lo.type}" />
      <span class="ml-2 mb-1"> {@html convertMd(lo.title)} </span>
      {#if lo.video && lo.type != 'panelvideo'}
        <a class="flex pl-1" href={lo.video}>
          <Icon type="video" />
        </a>
      {/if}
    </a>
  </div>
  {#if lo.type != 'lab'}
    {#if lo.los}
      <div class="mb-2">
        {#each lo.los as lo}
          <li class="ml-2 flex mb-0.5">
            <a class="flex" href={lo.route}>
              <Icon type="{lo.type}"/> <span class="pl-1"> {@html convertMd(lo.title)} </span> </a>
            {#if lo.video && lo.type != 'panelvideo'}
              <a class="flex pl-2" href={lo.video}>
                <Icon type="video" />
              </a>
            {/if}
          </li>
        {/each}
      </div>
    {/if}
  {/if}
{/each}
