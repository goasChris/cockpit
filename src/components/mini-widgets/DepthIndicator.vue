<template>
  <div class="flex items-center w-[8.25rem] h-12 p-1 text-white justify-center">
    <img src="@/assets/depth-icon.svg" class="h-full" :draggable="false" />
    <div class="flex flex-col items-start justify-center ml-1 min-w-[4rem] max-w-[6rem] select-none">
      <div>
        <span class="font-mono text-xl font-semibold leading-6 w-fit">{{ finalDepth.toPrecision(precision) }}</span>
        <span class="text-xl font-semibold leading-6 w-fit"> m</span>
      </div>
      <span class="w-full text-sm font-semibold leading-4 whitespace-nowrap">Depth</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { datalogger, DatalogVariable } from '@/libs/sensors-logging'
import { useMainVehicleStore } from '@/stores/mainVehicle'

const store = useMainVehicleStore()
datalogger.registerUsage(DatalogVariable.depth)

const depth = ref(0)
watch(store.altitude, () => (depth.value = -store.altitude.msl))
const finalDepth = computed(() => (depth.value < 0.01 ? 0 : depth.value))
const precision = computed(() => {
  const fDepth = finalDepth.value
  if (fDepth < 0.1) return 1
  if (fDepth < 1) return 2
  if (fDepth >= 1 && fDepth < 100) return 3
  if (fDepth >= 10000) return 5
  return 4
})
</script>
