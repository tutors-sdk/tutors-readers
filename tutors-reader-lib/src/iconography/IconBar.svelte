<script lang="ts">
  import Icon from "./Icon.svelte";
  import type { IconNavBar } from "../types/icon-types";

  export let nav: IconNavBar;
</script>

<div>
  {#each nav.bar as i}
    <span>
      <a href="{i.link}" target="{i.target}">
      <Icon toolTip="{i.tip}" type="{i.icon}" button="true" tipPos="tooltip-top"/>
      </a>
    </span>
  {/each}
</div>
