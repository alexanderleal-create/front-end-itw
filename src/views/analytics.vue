<template>
    <div>
        <ul class="flex space-x-2 rtl:space-x-reverse">
            <li>
                <a href="javascript:;" class="text-primary hover:underline">Dashboard</a>
            </li> 
        </ul>
        
    </div>
</template>
<script lang="ts" setup>
    import { ref, computed } from 'vue';
    import apexchart from 'vue3-apexcharts';
    import { useAppStore } from '@/stores/index';
    import { useMeta } from '@/composables/use-meta';

    import IconHorizontalDots from '@/components/icon/icon-horizontal-dots.vue';
    import IconTrendingUp from '@/components/icon/icon-trending-up.vue';
    import IconPlus from '@/components/icon/icon-plus.vue';
    import IconCreditCard from '@/components/icon/icon-credit-card.vue';
    import IconMail from '@/components/icon/icon-mail.vue';
    import IconChecks from '@/components/icon/icon-checks.vue';
    import IconFile from '@/components/icon/icon-file.vue';
    import IconServer from '@/components/icon/icon-server.vue';
    import IconChrome from '@/components/icon/icon-chrome.vue';
    import IconSafari from '@/components/icon/icon-safari.vue';
    import IconGlobe from '@/components/icon/icon-globe.vue';
    import IconUsersGroup from '@/components/icon/icon-users-group.vue';
    import IconLink from '@/components/icon/icon-link.vue';
    import IconChatDots from '@/components/icon/icon-chat-dots.vue';
    import IconThumbUp from '@/components/icon/icon-thumb-up.vue';
    import IconCaretsDown from '@/components/icon/icon-carets-down.vue';
    import IconSquareCheck from '@/components/icon/icon-square-check.vue';
    import IconClock from '@/components/icon/icon-clock.vue';

    useMeta({ title: 'Dashboard' });
    const store = useAppStore();

    // statistics
    const totalVisit = computed(() => {
        const isDark: boolean = store.theme === 'dark' || store.isDarkMode ? true : false;
        return {
            chart: {
                height: 58,
                type: 'line',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
                dropShadow: {
                    enabled: true,
                    blur: 3,
                    color: '#009688',
                    opacity: 0.4,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#009688'],
            grid: {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },
        };
    });

    const totalVisitSeries = ref([
        {
            data: [21, 9, 36, 12, 44, 25, 59, 41, 66, 25],
        },
    ]);

    //paid visit
    const paidVisit = computed(() => {
        const isDark: boolean = store.theme === 'dark' || store.isDarkMode ? true : false;
        return {
            chart: {
                height: 58,
                type: 'line',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
                dropShadow: {
                    enabled: true,
                    blur: 3,
                    color: '#e2a03f',
                    opacity: 0.4,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#e2a03f'],
            grid: {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },
        };
    });

    const paidVisitSeries = ref([
        {
            data: [22, 19, 30, 47, 32, 44, 34, 55, 41, 69],
        },
    ]);

    // unique visitors
    const uniqueVisitor = computed(() => {
        const isDark: boolean = store.theme === 'dark' || store.isDarkMode ? true : false;
        const isRtl = store.rtlClass === 'rtl' ? true : false;
        return {
            chart: {
                height: 360,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 2,
                colors: ['transparent'],
            },
            colors: ['#5c1ac3', '#ffbb44'],
            dropShadow: {
                enabled: true,
                blur: 3,
                color: '#515365',
                opacity: 0.4,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 10,
                },
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                itemMargin: {
                    horizontal: 8,
                    vertical: 8,
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                padding: {
                    left: 20,
                    right: 20,
                },
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                axisBorder: {
                    show: true,
                    color: isDark ? '#3b3f5c' : '#e0e6ed',
                },
            },
            yaxis: {
                tickAmount: 6,
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: isDark ? 'dark' : 'light',
                    type: 'vertical',
                    shadeIntensity: 0.3,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                y: {
                    formatter: (val: any) => {
                        return val;
                    },
                },
            },
        };
    });

    const uniqueVisitorSeries = ref([
        {
            name: 'Direct',
            data: [58, 44, 55, 57, 56, 61, 58, 63, 60, 66, 56, 63],
        },
        {
            name: 'Organic',
            data: [91, 76, 85, 101, 98, 87, 105, 91, 114, 94, 66, 70],
        },
    ]);

    // followers
    const followers = computed(() => {
        const isDark: boolean = store.theme === 'dark' || store.isDarkMode ? true : false;
        return {
            chart: {
                height: 160,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#4361ee'],
            grid: {
                padding: {
                    top: 5,
                },
            },
            yaxis: {
                show: false,
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },
            option: { fill: null },

            if(isDark: boolean) {
                option: {
                    fill: {
                        type: 'gradient';
                        gradient: {
                            type: 'vertical';
                            shadeIntensity: 1;
                            inverseColors: !1;
                            opacityFrom: 0.3;
                            opacityTo: 0.05;
                            stops: [100, 100];
                        }
                    }
                }
            },
        };
    });

    const followersSeries = ref([
        {
            data: [38, 60, 38, 52, 36, 40, 28],
        },
    ]);

    // referral
    const referral = computed(() => {
        const isDark: boolean = store.theme === 'dark' || store.isDarkMode ? true : false;
        return {
            chart: {
                height: 160,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#e7515a'],
            grid: {
                padding: {
                    top: 5,
                },
            },
            yaxis: {
                show: false,
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },

            if(isDark: boolean) {
                option: {
                    fill: {
                        type: 'gradient';
                        gradient: {
                            type: 'vertical';
                            shadeIntensity: 1;
                            inverseColors: !1;
                            opacityFrom: 0.3;
                            opacityTo: 0.05;
                            stops: [100, 100];
                        }
                    }
                }
            },
        };
    });

    const referralSeries = ref([
        {
            data: [60, 28, 52, 38, 40, 36, 38],
        },
    ]);

    // engagement
    const engagement = computed(() => {
        const isDark: boolean = store.theme === 'dark' || store.isDarkMode ? true : false;
        return {
            chart: {
                height: 160,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#1abc9c'],
            grid: {
                padding: {
                    top: 5,
                },
            },
            yaxis: {
                show: false,
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },

            if(isDark: boolean) {
                option: {
                    fill: {
                        type: 'gradient';
                        gradient: {
                            type: 'vertical';
                            shadeIntensity: 1;
                            inverseColors: !1;
                            opacityFrom: 0.3;
                            opacityTo: 0.05;
                            stops: [100, 100];
                        }
                    }
                }
            },
        };
    });

    const engagementSeries = ref([
        {
            name: 'Sales',
            data: [28, 50, 36, 60, 38, 52, 38],
        },
    ]);
</script>
