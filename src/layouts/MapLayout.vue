<template>
  <main
    class="p-4 lg:p-8 flex max-xs:flex-col h-full w-full max-w-[1440px] max-h-[1080px] m-auto overflow-hidden"
  >
    <slot />
    <div
      class="tooltip p-2 text-sm text-gray-800 absolute bg-white/80 rounded-md text-center pointer-events-none -translate-x-1/2 -translate-y-full transition after:content-[''] after:absolute after:top-full after:left-1/2 after:ml-[-5px] after:border-[5px] after:border-t-white/80 after:border-l-transparent after:border-r-transparent after:border-b-transparent max-xs:hidden"
      style="opacity: 0"
    />
  </main>
</template>
