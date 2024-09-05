<template>
  <h2>角材間距計算v1.0</h2>
  <v-container fluid>
    <v-form style="border: 1px solid black">
      <div style="background-color:beige;padding: 10px;display: flex;" class="inputs">
        <v-text-field label="總寬(mm)" variant="outlined" clearable type="number" v-model.number="totalWidth"
          :messages="(Math.round(this.totalWidth / 10 / 30.3 * 100) / 100) + '尺'" style="flex: 2;"></v-text-field>


      </div>
      <div style="background-color:beige;padding: 10px;display: flex;" class="inputs">
        <v-text-field :label="!isManual ? '角材寬度(mm)' : '手動加總角材總寬度(mm)'" variant="outlined" clearable type="number"
          v-model.number="squareWidth"
          :messages="(Math.round(this.squareWidth / 10 / 3.03 * 1000) / 1000) + '寸'" style="flex: 1;"></v-text-field>
      </div>

      <div style="background-color:beige;padding: 10px;display: flex;" class="inputs">
        <v-text-field label="角材數量(包含頭尾)" variant="outlined" clearable type="number" v-model.number="squareNumber"
          :hide-details="true" style="flex: 1;"></v-text-field>
      </div>

      <div style="background-color:beige;padding: 0 10px;display: flex;">
        <v-checkbox label="手動加總角材總寬度" v-model="isManual" color="red" hide-details @change="doManual"></v-checkbox>
      </div>

      <div style="background-color:beige;padding: 0 10px;display: flex;" class="inputs">
        <v-text-field label="間隔數量" variant="outlined"  type="number" v-model="spacing" readonly
          bg-color="#eeeeee"></v-text-field>
        <v-text-field label="角材總寬(mm)" variant="outlined"  type="number" v-model="squareTotal" readonly
          bg-color="#eeeeee"></v-text-field>


      </div>
      <div style="background-color:beige;padding: 0 10px;display: flex;" class="inputs">
        <v-text-field label="實內間距-未包含角材(mm)" variant="outlined"  type="number" v-model="spacingSize" readonly
          bg-color="#eeeeee" :messages="(Math.round(this.spacingSize / 10 / 30.3 * 100) / 100) + '尺'"></v-text-field>
        <v-text-field label="循還間距-角材中心位置(mm)" variant="outlined"  type="number" v-model="cycleSize" readonly
          bg-color="#eeeeee" :messages="(Math.round(this.cycleSize / 10 / 30.3 * 100) / 100) + '尺'"></v-text-field>
      </div>
    </v-form>

    <div v-if="isReady">
      <br>
      <br>

      <h2>間距等寬計算示意圖</h2>

      <div style="width:100%; height: 250px;" class="demoDiv" ref="demo">
        <template v-for="(no, index) in squareNumber" :key="no">
          <div
            style="border: 0px solid black; background-color: #cccccc;color: white; position: absolute;text-align: center;"
            :style='{
              "width": demoSquareWidth + "px",
              "height": "250px",
              "left": ((demoSpacingSize + demoSquareWidth) * (no - 1)) + "px"
            }'>
          </div>

          <div v-if="index === 0"
            style="position: absolute; height:250px;display: flex;align-items: center;justify-content: center;" :style='{
              "left": ((demoSpacingSize + demoSquareWidth) * (no - 1)) + "px",
              "width": (demoSpacingSize + demoSquareWidth) + "px"
            }'>
            {{ Math.round(spacingSize * 100) / 100 }}

          </div>

          <div
            style="position: absolute; border-radius: 50%; width: 20px;height: 20px;color: white ;background-color: blue;display: flex;align-items: center;justify-content: center;"
            :style='{
              "left": ((demoSpacingSize + demoSquareWidth) * (no - 1) - 5) + "px"
            }'>{{ no }}</div>
        </template>

      </div>
      (示意圖"非"正確比例)
      <br>
      <br>
      <h2>循環計算示意圖 - 頭尾角材貼齊邊緣，其餘對角材中心位置</h2>
      <div style="width:100%; height: 250px;" class="demoDiv" ref="demo">
        <template v-for="(no, index) in squareNumber" :key="no">
          <div v-if="no != squareNumber"
            style="display: flex;align-items: center;justify-content: center;position: absolute;border: 1px solid black;height: 250px;"
            :style='{
              "left": ((demoCycleSize) * (no - 1)) + "px",
              "width": (Math.round(demoCycleSize * 100) / 100) + "px"
            }'>
          </div>
          <div v-if="index === 0"
            style="display: flex;align-items: center;justify-content: center;position: absolute;height: 250px;" :style='{
              "left": ((demoCycleSize) * (no - 1)) + "px",
              "width": (Math.round(demoCycleSize * 100) / 100) + "px"
            }'>
            {{ Math.round(cycleSize * 100) / 100 }}
          </div>

          <div style="position: absolute; border-radius: 50%; width: 20px;height: 20px;color: white ;
            background-color: blue;display: flex;align-items: center;justify-content: center;" :style='{
              "left": ((demoCycleSize) * (no - 1) - 5) + "px"
            }'>{{ no }}</div>
        </template>

      </div>
      (示意圖"非"正確比例)
    </div>

  </v-container>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'

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
    }
  },
  mounted() {
    this.isReady = true
    this.$nextTick(() => {
      console.log("refs:", this.$refs.demo.offsetWidth)
      this.demoWidth = this.$refs.demo.offsetWidth
    })

    window.addEventListener("resize", () => {
      console.log("refs:", this.$refs.demo.offsetWidth)
      this.demoWidth = this.$refs.demo.offsetWidth
    });
  },
  methods: {
    doManual() {
      console.log(this.isManual)
    }
  },
  computed: {
    spacingSize() {
      return Math.round(((this.totalWidth - (this.realSquareWidth * this.squareNumber)) / (this.squareNumber - 1)) * 100) / 100
    },
    demoSpacingSize() {
      return (((this.demoWidth - (this.demoSquareWidth * this.squareNumber)) / (this.squareNumber - 1)))
    },
    spacing() {
      return this.squareNumber - 1
    },
    squareTotal() {
      if (this.isManual) {
        return this.squareWidth
      } else {
        return this.squareNumber * this.squareWidth
      }
    },
    realSquareWidth() {
      if (this.isManual) {
        return this.squareWidth / this.squareNumber
      } else {
        return this.squareWidth
      }

    },
    cycleSize() {
      return Math.round(this.totalWidth / (this.squareNumber - 1) * 100) / 100
    }
    , demoCycleSize() {
      return this.demoWidth / (this.squareNumber - 1)
    }

  }
}


</script>

<style scoped>
.demoDiv {
  margin-top: 20px;
  border: 1px solid rebeccapurple;
  position: relative;
  /* transform:scaleX(0.5);
  transform:scaleY(0.5); */
}

.inputs>.v-input {
  margin: 5px;
}
</style>
