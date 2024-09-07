<template>

  <v-container fluid>
    <h2>角材間距計算機v1.1</h2>
    <v-sheet style="border: 2px solid #cccccc;border-radius: 8px;padding: 10px;background-color: beige;">
      <v-row>
        <v-col>
          <v-select label="計算方式" density="compact" clearable hide-details :items="calcTypes" v-model="calcType"
            color="blue"></v-select>

          <div class="t-rules" style="color:blue">{{ this.calcTypes.filter((v) => v.value === this.calcType)[0].desc }}
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col>

          <v-combobox label="板材總寬(mm)" density="compact" color="blue" clearable hide-details :items="totalWidthData"
            v-model.number="totalWidth" :return-object="false" @keydown="totalWidthIdKeydown"></v-combobox>
          <div class="t-rules">表列為市售尺寸。換算後為 {{ (Math.round(this._totalWidth / 10 / 30.3 * 100) / 100) + ' 尺' }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field label="角材數量(包含頭尾)" color="blue" clearable type="number" v-model.number="squareNumber"
            hide-details density="compact"></v-text-field>
          <div style="margin-top: 10px;"></div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field :label="!isManual ? '角材寬度(mm)' : '角材總寬(mm)'" clearable type="number"
            v-model.number="squareWidth"
            hide-details density="compact"></v-text-field>
        </v-col>
        <v-col> <v-checkbox label="角材自行加總" v-model="isManual" color="red" hide-details></v-checkbox>
        </v-col>

      </v-row>

      <v-row>
        <v-col>

          <v-text-field label="間隔數量" type="number" v-model="spacing" readonly bg-color="#eeeeee" hide-details
            density="compact"></v-text-field>
        </v-col>

        <v-col>
          <v-text-field label="角材總寬(mm)" type="number" v-model="squareTotal" readonly bg-color="#eeeeee" hide-details
            density="compact"></v-text-field>

          <div class="t-rules"> {{ (Math.round(this.squareTotal / 10 / 30.3 * 100) / 100) + ' 尺' }}</div>
        </v-col>
      </v-row>



      <v-row>
        <v-col>
          <v-text-field label="間距(mm)" type="number" v-model="spacingSize" readonly bg-color="#eeeeee" hide-details
            density="compact"></v-text-field>

          <div class="t-rules"> {{ (Math.round(this.spacingSize / 10 / 30.3 * 100) / 100) + ' 尺' }}</div>
        </v-col>
      </v-row>
    </v-sheet>

    <div v-if="isReady">
      <div style="" class="demoDiv" ref="demo" :class="{ 'd-demoDiv': this.calcType === 'D' }">

        <!--TYPE A B C-->
        <template v-if="calcType !== 'D'" v-for="(no) in spacing">
          <div class="block" :class="{
            'a-first': this.calcType === 'A' && no === 1,
            'a-last': this.calcType === 'A' && no === spacing,
            'b-first': this.calcType === 'B' && no === 1,
            'b-last': this.calcType === 'B' && no === spacing,
            'c-first': this.calcType === 'C' && no === 1,
            'c-last': this.calcType === 'C' && no === spacing
          }
            ">{{ no }}</div>
        </template>

        <!--TYPE D-->
        <template v-else v-for="(no) in spacing">
          <div class="d-block" :class="{
            'd-first': no === 1,
            'd-last': no === spacing
          }
            ">{{ no }}</div>

          <div style="width: 3px;border-right: 2px dashed black;" v-if="no !== spacing"></div>
        </template>
      </div>
      (示意圖"非"正確比例，虛線是劃線位置)
    </div>

  </v-container>
</template>

<script>


export default {
  data() {
    return {
      totalWidth: 2440,
      squareWidth: 27.5,
      squareNumber: 7,
      isManual: false,
      isReady: false,
      demoWidth: -1,
      demoSquareWidth: 10,

      totalWidthData: [
        { title: '8尺(2440mm)', value: 2440 },
        { title: '7尺(2135mm)', value: 2135 },
        { title: '6尺(1830mm)', value: 1830 },
        { title: '4尺(1220mm)', value: 1220 },
        { title: '3尺(915mm)', value: 915 },
        { title: '2尺(610mm)', value: 610 }],
      calcType: "A",
      calcTypes: [
        { title: "有頭尾 ┃┃┃", value: "A", desc: "計算角材到角材之間的實內距離" },
        { title: "無頭尾 ┆┃┆", value: "B", desc: "計算角材到角材之間的實內距離，頭尾端無角材" },
        { title: "有頭無尾 ┃┃┆", value: "C", desc: "計算角材到角材之間的實內距離，尾端沒有角材" },
        { title: "循環計算 ┃┃┃...", value: "D", desc: "計算板材連續拼接的固定距離(頭尾的間距會不同)" }]
    }
  },
  mounted() {
    this.isReady = true
    this.$nextTick(() => {
      //console.log("refs:", this.$refs.demo.offsetWidth)
      this.demoWidth = this.$refs.demo.offsetWidth
    })

    window.addEventListener("resize", () => {
      //console.log("refs:", this.$refs.demo.offsetWidth)
      this.demoWidth = this.$refs.demo.offsetWidth
    });
  },
  methods: {

    totalWidthIdKeydown(e) {
      console.log(e.keyCode)
      if ((e.keyCode >= 48 && e.keyCode <= 57) || [37, 39, 46, 8].includes(e.keyCode)) {
        return
      }
      e.preventDefault()
    }
  },
  computed: {
    // 間隔數量
    spacing() {

      let n = 0
      switch (this.calcType) {
        case "A":
          n = this._squareNumber ?? 1 - 1
          break;
        case "B":
          n = this._squareNumber ?? 1 + 1
          break;
        case "C":
          n = this._squareNumber ?? 1
          break;
        case "D":
          n = this._squareNumber ?? 1 - 1
          break;

        default:
          break;
      }
      return n
    },
    // 間隔距離
    spacingSize() {

      let n = 0
      switch (this.calcType) {
        case "A":
          n = (this._totalWidth - this.realSquareTotal) / this.spacing
          break;
        case "B":
          n = (this._totalWidth - this.realSquareTotal) / this.spacing
          break;
        case "C":
          n = (this._totalWidth - this.realSquareTotal) / this.spacing
          break;
        case "D":
          n = this._totalWidth / this.spacing
          break;

        default:
          break;
      }

      return Math.round(n * 100) / 100;
    },

    // 角材總寬
    squareTotal() {
      if (this.isManual) {
        return this._squareWidth
      } else {
        return this._squareNumber ?? 1 * this._squareWidth
      }
    },

    // 實際角材總寬
    realSquareTotal() {
      if (this.isManual) {
        return this._squareWidth
      } else {
        return this._squareWidth * this._squareNumber ?? 1
      }

    },

    _squareNumber() {
      if (typeof this.squareNumber === 'number') {
        return this.squareNumber
      } else {
        return 1
      }
    },
    _squareWidth(){
      if (typeof this.squareWidth === 'number') {
        return this.squareWidth
      } else {
        return 1
      }
    },
    _totalWidth(){
      if (typeof this.totalWidth === 'number') {
        return this.totalWidth
      } else {
        return 1
      }
    }

  }
}


</script>

<style scoped>
.demoDiv {
  margin-top: 20px;
  border-left: 2px solid black;
  border-right: 2px solid black;
  display: flex;
  background-color: burlywood;
  width: 100%;
  height: 150px;
}



.t-rules {
  text-align: right;
  margin: 5px 5px 5px 0;
  font-size: 0.8em;
  color: blue;
}

.block {
  background-color: white;
  flex: 1;
  margin: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  border-left: 2px dashed black;
  border-right: 2px dashed black;
}

.d-block {
  background-color: white;
  flex: 1;
  margin: 0 5px;
  display: flex !important;
  align-items: center;
  justify-content: center;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}

.a-first {
  margin: 0 5px 0 10px;
}

.a-last {
  margin: 0 10px 0 5px;
}

.b-first {
  margin: 0 5px 0 0;
  border-left: 1px solid rgb(211, 211, 211);
}

.b-last {
  margin: 0 0 0 5px;
  border-right: 1px solid rgb(211, 211, 211);
}

.c-first {
  margin: 0 5px 0 10px;
}

.c-last {
  margin: 0 0 0 5px;
  border-right: 1px solid rgb(211, 211, 211);
}

.d-first {
  margin: 0 5px 0 10px;
}

.d-last {
  margin: 0 10px 0 5px;
}
</style>
