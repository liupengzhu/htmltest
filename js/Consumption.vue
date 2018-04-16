<style>
</style>
<template>
	<div class="full-height consumption">
		<div class="toolbar form-inline">
			<el-radio-group v-model="filter.date_type">
				<el-radio-button label="year">年</el-radio-button>
				<el-radio-button label="month">月</el-radio-button>
				<el-radio-button label="date">日</el-radio-button>
			</el-radio-group>
			<el-date-picker
					v-model="config.filter.time"
					:type="filter.date_type"
					:clearable="false"
					@change="changeTimeHandle"
					@focus="changeWidthHandle"
					:picker-options="pickerOptions0"
			>
			</el-date-picker>
			<el-radio-group v-model="filter.type">
				<el-radio-button label="original">原始数据</el-radio-button>
				<el-radio-button label="fold">等价折标</el-radio-button>
			</el-radio-group>
			<el-button
					v-if="'date'!==this.filter.date_type"
					icon="upload2"
					:loading="config.export_loading"
					@click="exportReportHandle">
				导出报表
			</el-button>
		</div>
		<div v-if="0===this.data.chart.data.length" style="width: 100%;line-height: 400px;color:#5e7382;text-align: center;border: 1px solid #ddd;">
			暂无数据
		</div>
		<chart v-else :options="chartPower" style="width: 100%; height: 400px;"></chart>
		<div v-if="'date'!==filter.date_type" class="consumption-month">
			<el-table
					key="month"
					:data="this.data.table_data"
					stripe
					border
			>
				<el-table-column
						prop="time"
						label="时间"
						width="190"
				></el-table-column>
				<el-table-column
						width="120"
						prop="rush"
						:label="'original'===this.filter.type?'尖（'+data.ratio+''+units.power+'）':'尖（'+units.energy_usage+'）'"
				>
					<template slot-scope="scope">
						<template v-if="scope.row.rush=='/'">-</template>
						<template v-else>{{scope.row.rush|formatNum}}</template>
					</template>
				</el-table-column>
				<el-table-column
						width="120"
						prop="peak"
						:label="'original'===this.filter.type?'峰（'+data.ratio+''+units.power+'）':'峰（'+units.energy_usage+'）'"
				>
					<template slot-scope="scope">
						<template v-if="scope.row.peak=='/'">-</template>
						<template v-else>{{scope.row.peak|formatNum}}</template>
					</template>
				</el-table-column>
				<el-table-column
						width="120"
						prop="valley"
						:label="'original'===this.filter.type?'谷（'+data.ratio+''+units.power+'）':'谷（'+units.energy_usage+'）'"
				>
					<template slot-scope="scope">
						<template v-if="scope.row.valley=='/'">-</template>
						<template v-else>{{scope.row.valley|formatNum}}</template>
					</template>
				</el-table-column>
				<el-table-column
						width="120"
						prop="normal"
						:label="'original'===this.filter.type?'平（'+data.ratio+''+units.power+'）':'平（'+units.energy_usage+'）'"
				>
					<template slot-scope="scope">
						<template v-if="scope.row.normal=='/'">-</template>
						<template v-else>{{scope.row.normal|formatNum}}</template>
					</template>
				</el-table-column>
				<el-table-column
						width="180"
						prop="total"
						:label="'original'===this.filter.type?'区间用电量（'+data.ratio+''+units.power+'）':'区间用电量（'+units.energy_usage+'）'"
				>
					<template slot-scope="scope">
						<template v-if="scope.row.total=='/'">-</template>
						<template v-else>{{scope.row.total|formatNum}}</template>
					</template>
				</el-table-column>
				<el-table-column
						width="200"
						prop="history_average"
						:label="'original'===this.filter.type?'同期历史均值（'+data.ratio+''+units.power+'）':'同期历史均值（'+units.energy_usage+'）'"
				>
					<template slot-scope="scope">
						<template v-if="scope.row.history_average=='/'">-</template>
						<template v-else>{{scope.row.history_average|formatNum}}</template>
					</template>
				</el-table-column>
				<el-table-column
						width="120"
						prop="range"
						label="增幅(%)"
				>
					<template slot-scope="scope">
						<div v-if="scope.row.range==0">
							<img src="/img/common/none.png" style="width: 18px;height: 18px;margin-right: 10px;float: left;">
							<template v-if="scope.row.range=='/'">-</template>
							<template v-else>{{scope.row.range|formatNum}}</template>
						</div>
						<div v-else-if="scope.row.range<0">
							<img src="/img/common/decline.png" style="width: 18px;height: 18px;margin-right: 10px;float: left;">
							<span style="color: #5cb85c;">
								<template v-if="scope.row.range=='/'">-</template>
								<template v-else>{{scope.row.range|formatNum}}</template>
							</span>
						</div>
						<div v-else-if="scope.row.range>0">
							<img src="/img/common/rise.png" style="width: 18px;height: 18px;margin-right: 10px;float: left;">
							<span style="color: #d9534f;">
								<template v-if="scope.row.range=='/'">-</template>
								<template v-else>{{scope.row.range|formatNum}}</template>
							</span>
						</div>
						<div v-else>
							<img src="/img/common/none.png" style="width: 18px;height: 18px;margin-right: 10px;float: left;">
							<template v-if="scope.row.range=='/'">-</template>
							<template v-else>{{scope.row.range|formatNum}}</template>
						</div>
					</template>
				</el-table-column>
				<el-table-column
						label="备注"
				></el-table-column>
			</el-table>
		</div>
		<div v-else style="width: 100%;position: absolute;top: 440px;bottom: 0;">
			<div class="col-sm-6 full-height" style="padding: 0;">
				<div v-if="0===this.data.peak_valley_pie.length" style="width: 100%;height: 100%;color:#5e7382;text-align: center;border: 1px solid #ddd;">
					暂无数据
				</div>
				<chart v-else :options="peakValleyPie" style="width: 100%; height: 100%;"></chart>
			</div>
			<div class="col-sm-6 full-height consumption-date" style="padding: 0;">
				<el-table
						key="date"
						:data="this.data.table_data"
						stripe
						border
				>
					<el-table-column
							prop="time"
							label="时间"
							width="190"
					>
					</el-table-column>
					<el-table-column
							width="180"
							prop="value"
							:label="'original'===this.filter.type?'区间用电量（'+data.table_ratio+''+units.power+'）':'区间用电量（'+units.energy_usage+'）'"
					>
						<template slot-scope="scope">
							<span style="float: right;">
								<template v-if="scope.row.value=='/'">-</template>
								<template v-else>{{scope.row.value|formatNum}}</template>
							</span>
						</template>
					</el-table-column>
					<el-table-column
							label="备注"
					></el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		mounted() {
			this.loadElectricity();
		},
		data() {
			return {
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() > Date.now();
					}
				},
				title: '',
				config: {
					filter: {
						time: new Date,
					},
					export_loading: false,
					chart_type: '',
				},
				filter: {
					type: 'original',
					date_type: 'month',
					time: '',
				},
				data: {
					ratio: '',
					chart_ratio: '',
					table_ratio: '',
					pie_ratio: '',
					chart: {
						normal: [],
						peak: [],
						rush: [],
						valley: [],
						data: [],
					},
					chart_type: '',
					table_data: [],
					x_name: [],
					peak_valley_pie: []
				},
				dataType: ['尖', '峰', '平', '谷'],
				chart_time: ''
			}
		},
		methods: {
			loadElectricity() {
				let formats = {year: 'YYYY', month: 'YYYY-MM', date: 'YYYY-MM-DD'};
				this.filter.time = this.$moment(this.config.filter.time).format(formats[this.filter.date_type]);
				if ((this.filter.time).split('-').length === 3) {
					this.chart_time = (this.filter.time).split('-')[0] + '年' + (this.filter.time).split('-')[1] + '月' + (this.filter.time).split('-')[2] + '日'
				}
				if ((this.filter.time).split('-').length === 2) {
					this.chart_time = (this.filter.time).split('-')[0] + '年' + (this.filter.time).split('-')[1] + '月'
				}
				if ((this.filter.time).split('-').length === 1) {
					this.chart_time = (this.filter.time).split('-')[0] + '年'
				}
				this.$api
					.get('/api/power/usage', this.filter)
					.then(response => {
						this.data = response.data;
						if (this.filter.date_type === 'date') {
							this.data = response.data;
							this.dataType = [];
							this.data.chart.data = [{
								name: '电量',
								type: 'line',
								step: 'end',
								color: ["rgb(70, 140, 200)"],
								markArea: {
									data: this.data.mark_area
								},
								data: this.data.chart
							}];
						}
						if (this.filter.date_type === 'month' || this.filter.date_type === 'year') {
							this.data = response.data;
							dataType: ['尖', '峰', '平', '谷'],
								this.data.chart.data = [
									{
										name: '谷',
										type: 'bar',
										barWidth: this.filter.date_type == 'year' ? '60%' : '80%',
										stack: '用电',
										color: ["rgb(95, 183, 96)"],
										data: this.data.chart.valley
									},
									{
										name: '平',
										type: 'bar',
										barWidth: this.filter.date_type == 'year' ? '60%' : '80%',
										stack: '用电',
										color: ["rgb(70, 140, 200)"],
										data: this.data.chart.normal
									},
									{
										name: '峰',
										type: 'bar',
										barWidth: this.filter.date_type == 'year' ? '60%' : '80%',
										stack: '用电',
										color: ["rgb(255, 136, 3)"],
										data: this.data.chart.peak
									},
									{
										name: '尖',
										type: 'bar',
										barWidth: this.filter.date_type == 'year' ? '60%' : '80%',
										stack: '用电',
										color: ["rgb(215, 84, 82)"],
										data: this.data.chart.rush
									},
								]
						}
					})
					.catch(error => {
						this.$notify.error({message: this.$error2message(error)});
					});
			},
			changeWidthHandle() {
				if (0 === $('.el-date-picker').length) return false;
				$('.el-date-picker')[0].style.width = $('.el-input')[0].offsetWidth * 1.3 + 'px';
			},
			changeTimeHandle() {
				this.loadElectricity();
			},
			exportReportHandle() {
				this.config.export_loading = true;
				this.$api.direct('/api/power/export', this.filter);
				(function (vm) {
					setTimeout(function () {
						vm.config.export_loading = false;
					}, 5000);
				})(this);
			}
		},
		computed: {
			units() {
				return this.$store.getters.units;
			},
			chartPower() {
				let vm = this;
				if (0 === this.data.chart.data.length)
					return {series: []};
				return {
					title: {
						text: `${this.chart_time} 区间用电量${'bar' === this.data.chart_type ? '柱形' : '曲线'}图`,
						top: 5,
						left: 'center',
						textStyle: {
							color: '#333',
							fontSize: 17,
							fontWeight: 'bold',
							fontFamily: 'Hiragino Sans GB, Microsoft YaHei, SimHei, WenQuanYi Micro Hei'
						}
					},
					legend: {
						left: 'center',
						bottom: 10,
						itemWidth: 16,
						itemHeight: 13,
						data: this.dataType
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							lineStyle: 'date' === this.filter.date_type ? {color: ['rgba(0,0,0,.3)']} : {color: ['rgba(0,0,0,0)']}
						},
						backgroundColor: '#fff',
						borderWidth: 1,
						borderColor: '#999',
						textStyle: {
							color: '#333'
						},
						formatter(params, ticket, callback) {
							params.reverse();
							let total_value = 0;
							let test = [];
							params.map(function (item) {
								total_value += (undefined === item.value) ? 0 : item.value;
								if (item.value !== undefined) {
									test.push(item);
								}
							});
							//判断是否存在数据
							for (let item in test) {
								if (test[item].value !== undefined) {
									return `时间：${test[0].axisValue}<br>
										${test.map(param => `
											<span style="color:${param.color}">${param.seriesName}</span>：${(0 === param.value) ? 0 : (parseFloat(param.value).toFixed(2) + '')} ${'original' === vm.filter.type ? (vm.filter.date_type === 'date' ? vm.data.chart_ratio : vm.data.ratio) + '' + vm.units.power : vm.units.energy_usage}
										`).join('<br>')}<br> ${'date' === vm.filter.date_type ? '' : '总量：' + `${(0.00 == total_value) ? 0 : (parseFloat(total_value).toFixed(2) + '')} ${'original' === vm.filter.type ? vm.data.ratio + '' + vm.units.power : vm.units.energy_usage}`}`;
								}
							}
						}
					},
					grid: {left: 100, right: 10},
					xAxis: {
						axisTick: {lineStyle: {color: '#'}},
						axisLine: {show: false},
						data: this.data.x_name
					},
					yAxis: {
						axisTick: {show: false},
						axisLine: {show: false},
						axisLabel: {formatter: `{value} ${'original' === this.filter.type ? (this.filter.date_type === 'date' ? vm.data.chart_ratio : vm.data.ratio) + '' + vm.units.power : vm.units.energy_usage}`}
					},
					series: this.data.chart.data
				};
			},
			peakValleyPie() {
				let vm = this;
				return {
					title: {
						text: '当日区间用电量排行占比图',
						x: 'center',
						textStyle: {
							fontWeight: 'bold',
							fontSize: 17
						}
					},
					legend: {
						top: 'middle',
						right: '120px',
						orient: 'vertical',
						data: this.data.legend,
					},
					tooltip: {
						trigger: 'item',
						formatter(params, ticket, callback) {
							return `${params.name}<br>${params.seriesName}：${params.value == null ? `/` : `${params.value} ${'original' === vm.filter.type ? vm.data.pie_ratio + '' + vm.units.power : vm.units.energy_usage} `}`
						}
					},
					color: ['rgb(255,136,3)', 'rgb(95,183,96)', 'rgb(70,140,200)'],
					series: [
						{
							name: '当日能耗',
							type: 'pie',
							radius: '60%',
							center: ['45%', '50%'],
							hoverAnimation: false,
							data: this.data.peak_valley_pie,
							label: {
								normal: {
									show: false
								},
							},
							itemStyle: {
								emphasis: {
									shadowBlur: 5,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							}
						}
					]
				}
			}
		},
		watch: {
			'filter.type'() {
				this.loadElectricity();
			},
			'filter.date_type'() {
				if (this.filter.date_type === 'date') {
					this.data = {
						chart: {
							normal: [],
							peak: [],
							rush: [],
							valley: [],
							data: [],
						},
						chart_type: '',
						table_data: [],
						x_name: [],
						peak_valley_pie: []
					}
				}
				if (this.filter.date_type === 'month' || this.filter.date_type === 'year') {
					this.data = {
						chart: {
							normal: [],
							peak: [],
							rush: [],
							valley: [],
							data: [],
						},
						chart_type: '',
						table_data: [],
						x_name: [],
					}
				}
			}
		}
	}
</script>