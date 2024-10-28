<template>
  <div class="full-view flex-row">
    <a-layout class="full-height">
      <a-layout-sider v-model:collapsed="collapsed" width="250" collapsible style="overflow-y: auto;">
        <a-menu
          v-model:openKeys="openKeys"
          v-model:selectedKeys="selectedKeys"
          theme="dark"
          mode="inline"
          :items="items"
          @click="menuClick"
        />
      </a-layout-sider>
    </a-layout>
    <div
      class="full-width full-height p-10 border-box view-box"
      style="overflow-y: hidden;"
    >
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, h, resolveComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const fullPath = route.fullPath.split('/')
const currentModule = router.options.routes.find(v => v.path === `/${fullPath[1]}`)
const collapsed = ref(false)
const menuTree = recursion(currentModule ? currentModule.children : [], currentModule.path)
const items = reactive(menuTree)
const selectedKeys = ref([route.fullPath])
const openKeys = ref([...findTreeFollowPath(menuTree, route.fullPath)])


function getItem (label, key, icon, children, type) {
  return { key, icon: () => h(resolveComponent(icon)), children, label, type }
}

function recursion (routerData, parentPath, resultMenuTree = []) {
  for (let i = 0; i < routerData.length; i++) {
    const item = _.cloneDeep(routerData[i])
    if (!item.path) {
      continue
    }
    const parentpath = `${parentPath}/${item.path}`
    const temp = getItem(item.meta.title, parentpath, item.meta.icon, item.children && item.children.length > 0 ? [] : undefined)
    if (item.children) {
      recursion(item.children, parentpath, temp.children)
    }
    resultMenuTree.push(temp)
  }
  return resultMenuTree
}

function findTreeFollowPath (tree, key, result = []) {
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i]
    if (item.children) {
      if (findTreeFollowPath(item.children, key, result)) {
        result.unshift(item.key)
        return result
      }
    } else if (item.key === key) {
      return result
    }
  }
}

function menuClick ({ keyPath }) {
  router.push({ path: keyPath[keyPath.length - 1] })
}


</script>

<style scoped lang="scss">
.view-box {
  background: #efefef;
}
</style>
