'use strict';

$(function() {
    Chart.defaults.global.defaultFontColor = "#fff";

    // richParliaments is `parliaments.json` enriched with
    // `$parliament.parties[$party].info` = `parties[$party]` from `parties.json`
    var richParliaments = parliaments.map(function(parliament) {
        var parliamentCopy = JSON.parse(JSON.stringify(parliament));
        for (var partyName of Object.keys(parliamentCopy.parties)) {
            var partyInfo = parties[partyName] || {};
            parliamentCopy.parties[partyName].info = JSON.parse(JSON.stringify(partyInfo));
        }
        return parliamentCopy;
    });

    var chartObjectBySelector = {};
    function updateChart(selector, content) {
        if (chartObjectBySelector[selector]) {
            var chartObject = chartObjectBySelector[selector];
            chartObject.data = content.data;
            chartObject.options = content.options;
            chartObject.update();

        } else {
            var canvas = $(selector)[0];
            var ctx = canvas.getContext('2d');
            var chartObject = new Chart(ctx, content);
            chartObjectBySelector[selector] = chartObject;
        }
    }

    function calculateValuesFromParliaments(valueFunctionData, valueFunction) {
        return richParliaments.map(function(parliament) {
            return Object.values(parliament.parties).reduce(function(reduced, party) {
                return reduced + valueFunction(valueFunctionData, party);
            }, 0);
        });
    }

    function partyValueFromDataType(dataType, party) {
        switch (dataType) {
            case 'אחוז מצביעים':
                return party.votersPercent;

            case 'מספר מנדטים':
                return party.mandates;

            case 'מספר מושבים (בסוף הכהונה)':
                return party.endSeats;

            default:
                console.error('Invalid dataType');
        }
    }

    function partyValuesFromDataType(dataType, parties) {
        return parties.map(function (party) {
            return partyValueFromDataType(dataType, party);
        });
    }

    function updateNumPartiesChart() {
        var data = richParliaments.map(function(parliament) {
            return Object.keys(parliament.parties).length;
        });

        updateChart('#numPartiesByKnesset .chart', {
            type: 'bar',
            data: {
                labels: Array(richParliaments.length).fill().map(function(v, i) { return i+1; }),
                datasets: [{
                    label: 'מספר מפלגות',
                    backgroundColor: 'royalblue',
                    data: data
                }]
            },
            options: {
                legend: {display: false},
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'מספר מפלגות'
                        },
                        ticks: {
                            min: 0
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'כנסת'
                        }
                    }]
                }
            }
        });
    }
    updateNumPartiesChart();

    function updateOrientationTrendsChart(dataType) {
        var leftParties = calculateValuesFromParliaments(dataType, function(dataType, party) {
            if (party.info.orientation === 'left') {
                return partyValueFromDataType(dataType, party);
            }
            return 0;
        });
        var rightParties = calculateValuesFromParliaments(dataType, function(dataType, party) {
            if (party.info.orientation === 'right') {
                return partyValueFromDataType(dataType, party);
            }
            return 0;
        });
        var centerParties = calculateValuesFromParliaments(dataType, function(dataType, party) {
            if (party.info.orientation === 'center') {
                return partyValueFromDataType(dataType, party);
            }
            return 0;
        });
        var otherParties = calculateValuesFromParliaments(dataType, function(dataType, party) {
            if (!party.info.orientation) {
                return partyValueFromDataType(dataType, party);
            }
            return 0;
        });

        updateChart('#orientationTrends .chart', {
            type: 'line',
            data: {
                labels: Array(richParliaments.length).fill().map(function(v, i) { return i+1; }),
                datasets: [{
                    label: 'אחר',
                    borderColor: 'green',
                    data: otherParties
                }, {
                    label: 'ימין',
                    borderColor: 'royalblue',
                    data: rightParties
                }, {
                    label: 'שמאל',
                    borderColor: 'orange',
                    data: leftParties
                }, {
                    label: 'מרכז',
                    borderColor: 'white',
                    data: centerParties
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: dataType
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'כנסת'
                        }
                    }]
                }
            }
        });
    }
    updateOrientationTrendsChart('אחוז מצביעים');
    $('#orientationTrends select').change(function() {
        var dataType = $(this).val();
        updateOrientationTrendsChart(dataType);
    });

    function updateAttributeTrendsChart(dataType) {
        var otherParties = calculateValuesFromParliaments(dataType, function(dataType, party) {
            if (!(party.info.arabic || party.info.radical || party.info.religious || party.info.socialist)) {
                return partyValueFromDataType(dataType, party);
            }
            return 0;
        });
        var arabicParties = calculateValuesFromParliaments(dataType, function(dataType, party) {
            if (party.info.arabic) {
                return partyValueFromDataType(dataType, party);
            }
            return 0;
        });
        var radicalParties = calculateValuesFromParliaments(dataType, function(dataType, party) {
            if (party.info.radical) {
                return partyValueFromDataType(dataType, party);
            }
            return 0;
        });
        var religiousParties = calculateValuesFromParliaments(dataType, function(dataType, party) {
            if (party.info.religious) {
                return partyValueFromDataType(dataType, party);
            }
            return 0;
        });
        var socialistParties = calculateValuesFromParliaments(dataType, function(dataType, party) {
            if (party.info.socialist) {
                return partyValueFromDataType(dataType, party);
            }
            return 0;
        });

        updateChart('#attributeTrends .chart', {
            type: 'line',
            data: {
                labels: Array(richParliaments.length).fill().map(function(v, i) { return i+1; }),
                datasets: [{
                    label: 'אחר',
                    borderColor: 'royalblue',
                    data: otherParties
                }, {
                    label: 'ערבי',
                    borderColor: 'green',
                    data: arabicParties
                }, {
                    label: 'דתי',
                    borderColor: 'white',
                    data: religiousParties
                }, {
                    label: 'רדיקלי',
                    borderColor: 'orange',
                    data: radicalParties
                }, {
                    label: 'סוציאליסטי',
                    borderColor: 'red',
                    data: socialistParties
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: dataType
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'כנסת'
                        }
                    }]
                }
            }
        });
    }
    updateAttributeTrendsChart('אחוז מצביעים');
    $('#attributeTrends select').change(function() {
        var dataType = $(this).val();
        updateAttributeTrendsChart(dataType);
    });

    function updatePartyByKnessetChart(knessetIndex, dataType) {
        var parliament = richParliaments[Number(knessetIndex)];
        var partyNames = Object.keys(parliament.parties);
        var data = partyValuesFromDataType(dataType, Object.values(parliament.parties));
        var partyColors = Object.values(parliament.parties).map(function(party) {
            return (party.info || {}).color || getRandomColor();

            function getRandomColor() {
                var letters = '0123456789ABCDEF';
                var color = '#';
                for (var i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            }
        });

        $('#partyByKnesset label .value').text('#' + (Number(knessetIndex) + 1));

        updateChart('#partyByKnesset .chart', {
            type: 'doughnut',
            data: {
                labels: partyNames,
                datasets: [{
                    data: data,
                    borderWidth: 1,
                    backgroundColor: partyColors
                }]
            }
        });
    }
    updatePartyByKnessetChart(0, 'אחוז מצביעים');
    function onPartyByKnessetChartControlUpdate() {
        var knessetIndex = $('#partyByKnesset input[type="range"]').val();
        var dataType = $('#partyByKnesset select').val();
        updatePartyByKnessetChart(knessetIndex, dataType);
    }
    $('#partyByKnesset input[type="range"]').attr('max', richParliaments.length-1);
    $('#partyByKnesset input[type="range"]').change(onPartyByKnessetChartControlUpdate);
    $('#partyByKnesset select').change(onPartyByKnessetChartControlUpdate);

    setTimeout(function() {
        $('#unfinishednessPopup').css('display', 'block');
    }, 5000);
    $('#unfinishednessPopup .closeBtn').click(function() {
        $('#unfinishednessPopup').css('display', 'none');
    });
});
