<template>
  <div class="centered-content">
      <button class="btn" @click="navigateToback">home</button>
    <h1>Price Per Hour Information</h1>
    <table>
      <thead>
        <tr>
          <th>Hour</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(price, hour) in prices" :key="hour">
          <td>{{ hour }} - {{ parseInt(hour) + 1 }}</td>
          <td>kr{{ price }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      prices: {}
    };
  },
  mounted() {
    this.fetchPricePerHourInfo();
  },
  methods: {
       navigateToback() {
    this.$router.push('/');
  },
      
    async fetchPricePerHourInfo() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/priceperhour');
        this.prices = response.data;
      } catch (error) {
        console.error('Error fetching price per hour info:', error);
      }
    }
  }
}
</script>

<style scoped>
.centered-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: burlywood;
}

table {
  width: 50%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}
.btn{
    color: #000;
    background-color: rgb(38, 165, 16);
    widows: 30px;
    height: 30px;
}
</style>
