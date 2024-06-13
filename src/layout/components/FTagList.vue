<script setup lang="ts">
import { ref } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'
import { getCookies, setCookies } from '@/utils/auth.ts'
import { TABS_NAME } from '@/constant/config.ts'
import { useUserStore } from '@/store/user.ts'
import { storeToRefs } from 'pinia'
import { TabCommand } from '@/constant/enum.ts'

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()

const { isCollapse } = storeToRefs(userStore)

interface TabsItem {
    title: string
    path: string
}

const activeTab = ref(route.path)

const tabList = ref<TabsItem[]>(
    getCookies(TABS_NAME) || [
        {
            title: '后台首页',
            path: '/',
        },
    ],
)

const onTabRemove = (v: string) => {
    let tabs = tabList.value
    let a = activeTab.value
    if (a === v) {
        tabs.forEach((tab, index) => {
            if (tab.path === v) {
                const nextTab = tabs[index + 1] || tabs[index - 1]
                if (nextTab) a = nextTab.path
            }
        })
    }
    activeTab.value = a
    tabList.value = tabList.value.filter((tab) => tab.path !== v)
    setCookies(TABS_NAME, tabList.value)
}

const onTabClick = (path: string) => {
    console.log('payh==>', path)
    router.push(path)
}

onBeforeRouteUpdate((to) => {
    activeTab.value = to.path
    const isInTabList = tabList.value.find((item) => item.path === to.path)
    if (!isInTabList) {
        tabList.value.push({
            title: to.meta.title,
            path: to.path,
        })
        setCookies(TABS_NAME, tabList.value)
    }
})

const handleClose = (c: TabCommand) => {
    if (c === TabCommand.clearOther) {
        tabList.value = tabList.value.filter((tab) => tab.path === '/' || tab.path === activeTab.value)
    }
    if (c === TabCommand.clearAll) {
        activeTab.value = '/'
        tabList.value = [{ title: '后台首页', path: '/' }]
    }
    setCookies(TABS_NAME, tabList.value)
}
</script>

<template>
    <div
        class="flex bg-gray-50 items-center px-4 py-1 fixed top-64px right-0"
        :class="isCollapse ? 'left-64px' : 'left-250px'"
    >
        <el-tabs v-model="activeTab" class="min-w-100px" type="card" @tab-change="onTabClick" @tab-remove="onTabRemove">
            <el-tab-pane
                v-for="item in tabList"
                :key="item.path"
                :closable="item.path !== '/'"
                :label="item.title"
                :name="item.path"
            >
            </el-tab-pane>
        </el-tabs>
        <el-dropdown class="ml-auto w-24px h-24px bg-white flex-center" @command="handleClose">
            <span>
                <el-icon>
                    <arrow-down />
                </el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item :command="TabCommand.clearOther">关闭其他</el-dropdown-item>
                    <el-dropdown-item :command="TabCommand.clearAll">关闭全部</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<style scoped>
:deep(.el-tabs--card > .el-tabs__header .el-tabs__nav) {
    border: none;
}

:deep(.el-tabs__header) {
    margin: 0;
    display: flex;
    align-items: center;
    border-bottom: none;
}

:deep(.el-tabs__item) {
    background: white;
    border-radius: 8px;
    margin: 0 4px;
    height: 32px;
}
</style>
