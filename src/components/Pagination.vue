<template>

  <nav class="toggle">
    <ul class="pagination">

      <li class="page-item label" aria-disabled="true">
        <button
            @click="pagination.currentPage = 1; $emit('reload',pagination.currentPage)" :disabled="isInFirstPage"
            class=""><font-awesome-icon :icon="'fast-forward'" rotation="180"></font-awesome-icon>
        </button>
      </li>

      <li class="page-item label" aria-disabled="true">
        <button
            @click="pagination.currentPage -= 1; $emit('reload',pagination.currentPage)" :disabled="isInFirstPage"
            class=""><font-awesome-icon :icon="'step-forward'" rotation="180"></font-awesome-icon>
        </button>
      </li>

      <div v-for="page in pages" :key="page.name" class="pagination-items">
        <li v-bind:class="{active : isActive(page.name)}"
            class="page-item label" aria-disabled="true">
          <button @click="pagination.currentPage = page.name; $emit('reload',pagination.currentPage)"
                  class="" :disabled="isActive(page.name)">{{ page.name }}
          </button>
        </li>
      </div>

      <li class="page-item label" aria-disabled="true">
        <button
            @click="pagination.currentPage += 1; $emit('reload',pagination.currentPage)"
            :disabled="isInLastPage"
            class=""><font-awesome-icon :icon="'step-forward'"></font-awesome-icon>
        </button>
      </li>

      <li class="page-item label" aria-disabled="true">
        <button
            @click="pagination.currentPage = pagination.lastPage; $emit('reload',pagination.currentPage)"
            :disabled="isInLastPage"
            class=""><font-awesome-icon :icon="'fast-forward'"></font-awesome-icon>
        </button>
      </li>


    </ul>
  </nav>

</template>

<script>
export default {
  name: "Pagination",
  props: {
    pagination: {
      currentPage: '',
      lastPage: '',
      maxVisibleButtons: 3,
    },
  },
  computed: {
    isInFirstPage() {
      return this.pagination.currentPage === 1;
    },
    isInLastPage() {
      return this.pagination.currentPage === this.pagination.lastPage;
    },
    startPage() {
      // When on the first page
      if (this.pagination.currentPage === 1) {
        return 1;
      }
      // When on the last page
      if (this.pagination.currentPage === this.pagination.lastPage) {
        return this.pagination.lastPage - this.pagination.maxVisibleButtons;
      }
      if (this.pagination.currentPage + 1 === this.pagination.lastPage) {
        return this.pagination.lastPage - this.pagination.maxVisibleButtons;
      }
      // When in between
      return this.pagination.currentPage - 1;
    },
    pages() {
      const range = [];

      for (let i = this.startPage; i <= Math.min(this.startPage + this.pagination.maxVisibleButtons, this.pagination.lastPage); i += 1) {
        range.push({
          name: i,
        });
      }
      return range;
    }
  },
  data: function () {
    return {}
  },

  methods: {
    isActive: function (n) {
      return n === this.pagination.currentPage;
    },
  }
}
</script>
