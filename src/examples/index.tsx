import Vue from 'vue'
import Component from 'vue-class-component'

@Component({})
export default class App extends Vue {
  msg: number = 1;

  add() {
    this.msg = this.msg + 1
  };

  render(h) {
    return (
      <div id={'app'} class={this.$style['index-ts']} onClick={this.add}>
        {this.msg}
      </div>
    )
  }
}
