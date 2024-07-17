export interface OpenAnalyticsParams {
  onReport: () => void;
}

export class OpenAnalytics {
  onReport: () => void;
  constructor(params: OpenAnalyticsParams) {
    this.onReport = params.onReport;
  }
  report(event: string, data: Record<string, any>): void {
    console.log('report', event, data);
  }
}
