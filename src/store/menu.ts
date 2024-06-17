import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Menus } from '@/api/user.ts'
import { addRoutes } from '@/router'

export const useMenuStore = defineStore(
    'menu',
    () => {
        const menus = ref<Menus[]>([])

        const setMenus = (data: Menus[]) => {
            addRoutes(data)
            menus.value = data
        }

        const isCollapse = ref(false)

        const setCollapse = (value: boolean) => {
            isCollapse.value = value
        }

        return {
            menus,
            setMenus,
            isCollapse,
            setCollapse,
        }
    },
    {
        persist: true,
    },
)
