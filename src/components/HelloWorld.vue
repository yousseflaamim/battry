<template>
  <div class="charging-station">
    <div class="charging-station-content"> 
      <button class="bn" @click="navigateToPricePerHour">Go to Price Per Hour</button>
      <button class="bn" @click="navigateToStaionIformation">Station Information</button>
      <h1>Charging Station</h1>
      <div v-if="isLoading">Loading...</div>
      <div v-else>
        <div>
          <h2>Simulation Time</h2>
          <p>Time: {{ simulationTime }}</p>
        </div>
        <div>
          <h2>Total Energy Consumption</h2>
          <p>Energy Consumption: {{ totalEnergyConsumption }} kWh</p>
        </div>
        <div>
          <h2>Charging Task</h2>
          <p v-if="isChargingTask1">Charging Task 1: Charge when household consumption is low</p>
          <p v-else-if="isChargingTask2">Charging Task 2: Charge when electricity price is low</p>
          <p v-else>No charging task</p>
        </div>
        <p v-if="chargingStatus !== null">Charging Status: {{ chargingStatus }}</p>
        <p v-if="batteryPercentage !== null">Battery Percentage: {{ batteryPercentage }}%</p>
        <div class="button-container">
          <button class="round-button start" @click="startCharging" :disabled="isCharging">Start</button>
          <button class="round-button stop" @click="stopCharging" :disabled="!isCharging">Stop</button>
          <button class="round-button discarge" @click="startDischarging">Discharging</button>
          <p v-if="dischargingStatus !== null">Discharging Status: {{ dischargingStatus }}</p>
        </div>
        <div class="battery-bar">
          <div class="battery-level" :style="{ width: batteryCharge + '%' }" :class="{ 'charging-color': isCharging }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import PricePerHour from '../components/PricePerHour.vue';

export default {
  data() {
    return {
      PricePerHour,
      isLoading: true,
      simulationTime: null,
      totalEnergyConsumption: null,
      isCharging: false,
      batteryCharge: 0,
      dischargingStatus: null,
      chargingIntervalId: null,
      isChargingTask2: false,
      isChargingTask1: true,
      timer: null,
      chargingStatus: null,
      batteryPercentage: null,
      stoppedBatteryCharge: 0, 
    };
  },
  created() {
    this.fetchData();
    setInterval(this.fetchData, 10000);
  },
  methods: {
    navigateToPricePerHour() {
      this.$router.push('/PricePerHour');
    },
    navigateToStaionIformation() {
      this.$router.push('/StationInfo');
    },
    toggleChargingTask2() {
      this.isChargingTask2 = !this.isChargingTask2; 
    },
    toggleChargingTask1() {
      this.isChargingTask1 = !this.isChargingTask1; 
    },
    async fetchData() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/info');
        this.simulationTime = response.data.sim_time_hour + ':' + response.data.sim_time_min;
        this.totalEnergyConsumption = response.data.base_current_load;
        this.batteryCharge = response.data.battery_capacity_kWh;
        this.isLoading = false;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async startCharging() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/info');
    const baseCurrentLoad = response.data.base_current_load;
    const respons = await axios.get('http://127.0.0.1:5000/priceperhour');
const prices = respons.data;
await this.fetchBatteryPercentage();

const minValue = Math.min(...prices);
const maxValue = Math.max(...prices);

const averageValue = (minValue + maxValue) / 2;

const maxThreshold = averageValue / 2;


if (baseCurrentLoad <= 8 && maxThreshold < averageValue)
 {
          await axios.post('http://127.0.0.1:5000/charge', { charging: 'on' });
          console.log('Charging started successfully');
          this.isCharging = true;
          this.simulateCharging();
        } else {
          console.log('Energy consumption is too high to start charging');
        }
      } catch (error) {
        console.error('Error starting charging:', error);
      }
    },
    async stopCharging() {
      try {
        await axios.post('http://127.0.0.1:5000/charge', { charging: 'off' });
        console.log('Charging stopped successfully');
        this.isCharging = false;
        await this.fetchBatteryPercentage(true);
        clearInterval(this.chargingIntervalId);
        //this.batteryPercentage = 100;
      } catch (error) {
        console.error('Error stopping charging:', error);
      }
    },
    simulateCharging() {
      this.fetchBatteryData();
      const initialCharge = 20;
      const targetCharge = 80;
      const chargeToReach = targetCharge - initialCharge;
      const chargePerMinute = chargeToReach / 30;
      this.batteryCharge = initialCharge;
      this.chargingIntervalId = setInterval(() => {
        this.batteryCharge += chargePerMinute;
        if (this.batteryCharge >= targetCharge) {
          clearInterval(this.chargingIntervalId);
          this.stopCharging();
        }
      }, 1000);
    },
    async fetchBatteryData() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/info');
        this.batteryCharge = response.data.battery_capacity_kWh;
      } catch (error) {
        console.error('Error fetching battery data:', error);
      }
    },
    startDischarging() {
      axios.post('http://127.0.0.1:5000/discharge', { discharging: 'on' })
        .then(response => {
          this.dischargingStatus = response.data.discharging;
          this.startTimer();
          this.fetchBatteryPercentage();
        })
        .catch(error => {
          console.error('Error starting discharging:', error);
        });
    },
    startTimer() {
      this.timer = setTimeout(() => {
        this.dischargingStatus = null;
      }, 500);
    },
    fetchBatteryPercentage(keepPercentage = false) {
      axios.get('http://127.0.0.1:5000/charge')
        .then(response => {
          this.batteryPercentage = response.data;
          if (!keepPercentage && !this.isCharging) {
            this.batteryPercentage = 20;
          }
        })
        .catch(error => {
          console.error('Error fetching battery percentage:', error);
        });
    }
  },
  mounted() {
    this.fetchBatteryPercentage();
  }
};
</script>

<style scoped>
h1, h2, h3 {
  color: #000;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.charging-station {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("@/assets/car1.jpeg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

p {
  color: black;
}

.charging-station-content {
  width: 50%;
  background-color: #f0f0f0;
  padding: 20px;
  background-color: rgba(240, 240, 240, 0.5);
}

.button-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.round-button-container {
  margin: 0 10px;
}

.round-button {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.start {
  background-color: green;
}

.stop {
  background-color: red;
}

.discarge {
  background: #d5d816;
}

.battery-bar {
  width: 200px;
  height: 40px;
  border: 1px solid #000;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  margin: 20px auto;
}

.battery-level {
  height: 100%;
  background-color: #4caf50;
  position: absolute;
  left: 0;
  top: 0;
  transition: width 0.5s;
}

.charging-color {
  background-color: #4caf50;
}
.bn{
    padding: 3;
    background-color: cadetblue;
}

</style>
