<template>
  <div class="relative flex items-center justify-center w-48 p-1 rounded-md shadow-inner h-9 bg-slate-800/60">
    <span class="ml-2 truncate text-sm" :title="displayLabel">{{ displayLabel }}</span>

    <button class="relative flex items-center justify-center w-24 p-1 h-9" @click="toggle()">
      <div
        class="absolute flex items-center px-2 rounded-[4px] transition-all w-[80%] h-[80%]"
        :class="currentIsOn ? 'bg-green-600 justify-end left-[15%]' : 'bg-red-600 justify-start left-[5%]'"
      >
        <span class="font-extrabold align-middle unselectable">{{ currentLabel }}</span>
      </div>
    </button>

    <v-dialog
      v-model="widgetStore.miniWidgetManagerVars(miniWidget.hash).configMenuOpen"
      class="w-[100vw] flex justify-center items-center"
    >
      <v-card class="config-modal p-8" :style="interfaceStore.globalGlassMenuStyles">
        <div class="close-icon mdi mdi-close" @click.stop="closeDialog"></div>
        <v-card-title class="text-white">Param Toggle Configuration</v-card-title>
        <div class="flex flex-col gap-3">
          <label for="label" class="text-sm text-slate-100/75">Label</label>
          <input id="label" v-model="miniWidget.options.label" class="w-full px-2 py-1 rounded-md bg-[#FFFFFF12]" />

          <label for="parameterName" class="text-sm text-slate-100/75"
            >Parameter Name (e.g. ACRO_ROTAT_PAT) — if set widget will send PARAM_SET</label
          >
          <input
            id="parameterName"
            v-model="miniWidget.options.parameterName"
            class="w-full px-2 py-1 rounded-md bg-[#FFFFFF12]"
          />

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label for="onValue" class="text-sm text-slate-100/75">On Value</label>
              <input
                id="onValue"
                v-model="miniWidget.options.onValue"
                class="w-full px-2 py-1 rounded-md bg-[#FFFFFF12]"
              />
            </div>
            <div>
              <label for="offValue" class="text-sm text-slate-100/75">Off Value</label>
              <input
                id="offValue"
                v-model="miniWidget.options.offValue"
                class="w-full px-2 py-1 rounded-md bg-[#FFFFFF12]"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label for="onLabel" class="text-sm text-slate-100/75">On Label</label>
              <input
                id="onLabel"
                v-model="miniWidget.options.onLabel"
                class="w-full px-2 py-1 rounded-md bg-[#FFFFFF12]"
              />
            </div>
            <div>
              <label for="offLabel" class="text-sm text-slate-100/75">Off Label</label>
              <input
                id="offLabel"
                v-model="miniWidget.options.offLabel"
                class="w-full px-2 py-1 rounded-md bg-[#FFFFFF12]"
              />
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-2">
            <button class="px-3 py-1 rounded-md bg-[#FFFFFF12]" @click="closeDialog">Close</button>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRefs } from 'vue'

import { useSnackbar } from '@/composables/snackbar'
import { useAppInterfaceStore } from '@/stores/appInterface'
import { useMainVehicleStore } from '@/stores/mainVehicle'
import { useWidgetManagerStore } from '@/stores/widgetManager'
import type { MiniWidget } from '@/types/widgets'

const props = defineProps<{
  /**
   * Configuration of the widget
   */
  miniWidget: MiniWidget
}>()
const miniWidget = toRefs(props).miniWidget
const widgetStore = useWidgetManagerStore()
const interfaceStore = useAppInterfaceStore()
const mainVehicleStore = useMainVehicleStore()
const { openSnackbar } = useSnackbar()

// Ensure options defaults
onMounted(() => {
  if (!miniWidget.value.options || Object.keys(miniWidget.value.options).length === 0) {
    Object.assign(miniWidget.value.options, {
      parameterName: '',
      label: '',
      onValue: 'true',
      offValue: 'false',
      onLabel: 'On',
      offLabel: 'Off',
    })
  }
  // Start listeners depending on configuration
  const hasParam = Boolean(miniWidget.value.options.parameterName)
  if (hasParam) {
    startVehicleParameterListener()
  }
})

let paramHandler: ((arg1: [any, number | undefined]) => void) | undefined = undefined
const currentRaw = ref<unknown>(undefined)

const displayLabel = computed(() => {
  try {
    return (miniWidget.value && miniWidget.value.options && miniWidget.value.options.label) || ''
  } catch (e) {
    return ''
  }
})

const parseStored = (raw: string): string | number | boolean => {
  if (raw === 'true') return true
  if (raw === 'false') return false
  const n = Number(raw)
  if (!Number.isNaN(n)) return n
  return raw
}

const parseOptionValue = (v: unknown): string | number | boolean => {
  if (typeof v === 'string') return parseStored(v)
  return v as string | number | boolean
}

const startVehicleParameterListener = (): void => {
  const paramName = miniWidget.value.options.parameterName
  if (!paramName) return
  // Handler receives [Parameter, totalCount]
  paramHandler = ([newParam]: [any, number | undefined]) => {
    if (!newParam) return
    if (newParam.name === paramName) {
      currentRaw.value = newParam.value
    }
  }

  // Register handler
  mainVehicleStore.mainVehicle?.onParameter.add(paramHandler)

  // Populate initial value if available
  const last = mainVehicleStore.mainVehicle?.lastParameter()
  if (last && last.name === paramName) currentRaw.value = last.value
}

const stopListening = (): void => {
  if (paramHandler) {
    mainVehicleStore.mainVehicle?.onParameter.remove(paramHandler)
    paramHandler = undefined
  }
}

onUnmounted(() => stopListening())

const currentIsOn = computed(() => {
  const onV = parseOptionValue(miniWidget.value.options.onValue)
  return currentRaw.value !== undefined && currentRaw.value === onV
})

const currentLabel = computed(() =>
  currentIsOn.value ? miniWidget.value.options.onLabel : miniWidget.value.options.offLabel
)

const toggle = (): void => {
  if (widgetStore.editingMode) return

  const paramName = miniWidget.value.options.parameterName
  const onV = parseOptionValue(miniWidget.value.options.onValue)
  const offV = parseOptionValue(miniWidget.value.options.offValue)
  const newVal = currentIsOn.value ? offV : onV

  // Send PARAM_SET via vehicle API
  if (paramName && mainVehicleStore.mainVehicle) {
    const numeric = typeof newVal === 'number' ? newVal : Number(newVal)
    // @ts-ignore
    mainVehicleStore.mainVehicle.setParameter({ id: paramName, value: numeric })
    currentRaw.value = numeric
  } else {
    openSnackbar({
      message: 'Parameter name not configured or vehicle not connected. Cannot toggle.',
      variant: 'error',
      duration: 3000,
    })
  }
}

const closeDialog = (): void => {
  widgetStore.miniWidgetManagerVars(miniWidget.value.hash).configMenuOpen = false
}
</script>

<style scoped>
.close-icon {
  position: fixed;
  top: 8px;
  right: 12px;
  cursor: pointer;
  color: white;
  font-size: 22px;
}
.config-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 6px;
}
</style>
