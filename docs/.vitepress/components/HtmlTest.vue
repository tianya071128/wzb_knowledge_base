<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { ref, computed } from 'vue';

defineProps<{
  type: 'getCursor' | 'setCursor' | 'selectAllText' | 'selectPartText';
}>();

/**
 * 获取光标位置
 * @params {DOM} dom 输入框控件
 */
function getCursorPos(dom: HTMLInputElement | HTMLTextAreaElement) {
  if (
    (dom instanceof HTMLInputElement || dom instanceof HTMLTextAreaElement) &&
    document.activeElement === dom
  ) {
    let pos = 0;
    if ('selectionStart' in dom) {
      // IE8- 不支持
      pos = dom.selectionStart ?? 0; // 获取光标开始的位置
    } else if ('selection' in document) {
      // 兼容 IE
      (dom as any).focus();
      const selectRange = (document.selection as any).createRange();
      selectRange.moveStart('character', -(dom as any).value.length);
      pos = selectRange.text.length;
    }
    return pos;
  } else {
    throw new Error('参数错误或输入框没有获取焦点');
  }
}
/**
 * 设置光标位置
 * @params {DOM} dom 输入框控件
 * @params {Number} pos 需要设置光标位置
 */
function setCursorPos(
  dom: HTMLInputElement | HTMLTextAreaElement,
  pos: number
) {
  if (dom instanceof HTMLInputElement || dom instanceof HTMLTextAreaElement) {
    if (dom.setSelectionRange) {
      dom.focus();
      dom.setSelectionRange(pos, pos);
    } else if ((dom as any).createTextRange) {
      const range = (dom as any).createTextRange; // 创建文本范围
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  } else {
    throw new TypeError('no');
  }
}

/**
 * 获取光标选择的文本
 * @params {DOM} dom 输入框控件
 * @returns {String} 选择的文本
 */
function getSelectText(dom: any) {
  if (typeof dom.selectionStart === 'number') {
    // IE8- 不支持
    return dom.value.substring(dom.selectionStart, dom.selectionEnd);
  } else if ((document as any).selection) {
    // 兼容 IE8-
    return (document as any).selection.createRange().text;
  }
}

function onFocus(e: FocusEvent) {
  const dom = e.target as HTMLInputElement;

  setTimeout(() => {
    ElMessage(`光标位置${getCursorPos(dom)}`);
  }, 0);
}

const setCursorRef = ref<typeof import('element-plus')['ElInput']>();
const setCursorInput = computed(() => {
  const el = setCursorRef.value?.$el;
  return el?.querySelector('input.el-input__inner');
});
function setCursor() {
  setCursorInput.value && setCursorPos(setCursorInput.value, 5);
}

function onFocus2(e: FocusEvent) {
  (e.target as HTMLInputElement).select();
}

function onSelect(e: FocusEvent) {
  const dom = e.target;

  ElMessage(`选择的文本为：${getSelectText(dom)}`);
}
</script>

<template>
  <div style="margin-top: 10px">
    <div v-if="type === 'getCursor'">
      <el-input
        :model-value="'点击输入框获取光标位置'"
        @focus="onFocus"></el-input>
    </div>

    <div v-if="type === 'setCursor'">
      <el-input
        ref="setCursorRef"
        :model-value="'点击按钮设置光标位置'"
        @focus="onFocus"></el-input>
      <br />
      <br />
      <el-button @click="setCursor">设置光标位置</el-button>
    </div>

    <div v-if="type === 'selectAllText'">
      <el-input type="text" @focus="onFocus2" value="获取焦点选择全部文本" />
    </div>

    <div v-if="type === 'selectPartText'">
      <el-input
        type="text"
        @select="onSelect"
        value="尝试选择文本，查看选择文本的内容" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
