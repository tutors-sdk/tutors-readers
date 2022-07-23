<script lang="ts">
  import {afterUpdate, getContext, onDestroy} from "svelte";
  import type {Course} from "tutors-reader-lib/src/models/course";
  import CardDeck from "../components/cards/CardDeck.svelte";
  import UnitCard from "../components/cards/UnitCard.svelte";
  import type {CourseService} from "../reader-lib/services/course-service";
  import type {AnalyticsService} from "../reader-lib/services/analytics-service";
  import {currentLo, revealSidebar} from "../stores";

  import * as animateScroll from "svelte-scrollto";
  import {viewDelay} from "../components/animations";

  export let params: Record<string, string> | null

  let course: Course | undefined;
  const cache: CourseService = getContext("cache");
  const analytics: AnalyticsService = getContext("analytics");
  let title = "";
  let standardDeck = true;
  let pinBuffer = "";
  let ignorePin = "";
  let hide = true;
  window.addEventListener("keydown", keypressInput);

  async function getCourse(url: string) {
    revealSidebar.set(false);
    course = await cache.fetchCourse(url);
    hide = true;
    setTimeout(() => {
      hide = false;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      currentLo.set(course!.lo);
      title = course!.lo.title;
      analytics.pageLoad(url, course!, course!.lo);
      if (course?.lo.properties.ignorepin) {
        ignorePin = "" + course.lo.properties.ignorepin;
      }
    }, viewDelay);
    return course;

  }

  function keypressInput(e) {
    pinBuffer = pinBuffer.concat(e.key);
    if (pinBuffer === ignorePin) {
      course?.showAllLos();
      course!.standardLos = course!.allLos;
      standardDeck = false;
    }
  }

  onDestroy(async () => {
    window.removeEventListener("keydown", keypressInput);
  });

  afterUpdate(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    animateScroll.scrollTo({delay: 200, element: "#top"});
  });
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

{#await getCourse(params.wild) then course}
  {#if !hide}
    {#each course.units as unit}
      <UnitCard {unit}/>
    {/each}
    {#if standardDeck}
      <CardDeck los={course.standardLos}/>
    {:else}
      <CardDeck los={course.allLos}/>
    {/if}
  {/if}
{/await}

