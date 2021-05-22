import * as Chartist from 'chartist';
import {ForecastGroup, TempUnit} from '../lib/Forecast';

const cx = {
    container: 'overview-graph',
    chart: 'ct-chart'
};

enum GraphLabels {
    DAY_DATE,
    DAY_NAME
}

const USE_GRAPH_LABEL: GraphLabels = GraphLabels.DAY_NAME;

const toEnglishDayName = (dayNum: number) => {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayNum] || 'Unknown';
};

export class ForecastChartistOverviewGraph {
    private getSeries(groups: Array<ForecastGroup>): Array<number> {
        const result: Array<number> = [];
        for (const group of groups) {
            for (const f of group.getForecasts()) {
                const temp: string = f.getTemp(TempUnit.AUTO);
                result.push(parseInt(temp.substring(0, temp.length - 2)));
            }
        }
        return result;
    }

    private getLabels(groups: Array<ForecastGroup>): Array<string> {
        const result: Array<string> = [];
        for (const group of groups) {
            for (let i = 0, fcs = group.getForecasts(); i < fcs.length; i++) {
                if (fcs.length < 4 || i)
                    result.push('');
                else {
                    switch (USE_GRAPH_LABEL) {
                    case GraphLabels.DAY_NAME:
                        result.push(toEnglishDayName(fcs[i].getLocalDate().getDay()));
                        break;
                    case GraphLabels.DAY_DATE:
                        result.push(fcs[i].getLocalDate().toLocaleDateString());
                        break;
                    default:
                        result.push('?');
                    }
                }
            }

        }
        return result;
    }

    create(groups: Array<ForecastGroup>): HTMLElement {
        const figure: HTMLElement = document.createElement('figure');
        figure.classList.add(cx.container);
        figure.classList.add(cx.chart);
        try {
            const data = {
                labels: this.getLabels(groups),
                series: [
                    this.getSeries(groups)
                ]
            };
            const sampleUnit: string = groups[0].getForecasts()[0].getTemp(TempUnit.AUTO);
            const tempUnit: string = sampleUnit.substring(sampleUnit.length - 2, sampleUnit.length);
            const opts = {
                stretch: true,
                showArea: true,
                axisY: {
                    labelInterpolationFnc: function (value: string) {
                        return value + tempUnit;
                    }
                },
                showPoint: false
            };
            const chart = new Chartist.Line(figure, data, opts);
            chart.on('draw', function (data: any) {
                if (data.type === 'line' || data.type === 'area') {
                    data.element.animate({
                        d: {
                            begin: 2000 * data.index,
                            dur: 1500,
                            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height())
                                .stringify(),
                            to: data.path.clone().stringify(),
                            easing: Chartist.Svg.Easing.easeInOutSine
                        }
                    });
                }
            });
        } catch (e) {
            console.error(e);
        }
        return figure;
    }
}