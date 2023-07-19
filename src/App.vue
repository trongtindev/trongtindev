<template>
  <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

  <div class="wrapper center">
    <h1>Tin Nguyen Trong</h1>
    <h2>description</h2>
    <div class="space"></div>

    <div class="groups">
      <md-outlined-button href="https://github.com/trongtindev">
        github.com/trongtindev
      </md-outlined-button>
      <md-outlined-button href="mailto:me@trongtin.dev"> me@trongtin.dev</md-outlined-button>
    </div>
    <div class="space"></div>

    <md-switch
      label="Dark mode"
      :selected="scheme == 'dark'"
      @click="() => setColorScheme('toggle')"
    ></md-switch>
  </div>
</template>

<script lang="ts">
import '@material/web/icon/icon.js';
import '@material/web/button/filled-button';
import '@material/web/button/outlined-button';
import '@material/web/chips/suggestion-chip';
import '@material/web/switch/switch';

interface Data {
  scheme: 'light' | 'dark';
}

export default {
  data () {
    return {
      scheme: 'light',
    } as Data;
  },
  mounted () {
    this.setColorScheme(this.getPreferredColorScheme());
  },
  methods: {
    setColorScheme (scheme: 'light' | 'dark' | 'toggle') {
      if (scheme == 'toggle') {
        this.scheme = this.scheme == 'dark' ? 'light' : 'dark';
      }
      else {
        this.scheme = scheme;
      }

      switch (this.scheme) {
        case 'dark':
          document.body.className = 'dark';
          break;

        default:
          document.body.className = 'light';
          break;
      }
    },
    getPreferredColorScheme () {
      if (window.matchMedia) {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
        }
        else {
          return 'light';
        }
      }
      return 'light';
    },
  },
};
</script>