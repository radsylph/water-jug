export interface waterInterface {
    x_capacity: number;
    y_capacity: number;
    z_amount_wanted: number;
}

export interface stepInterface {
    step: number;
    bucketX: number;
    bucketY: number;
    action: string;
}

export interface solutionInterface {
    totalSteps: number;
    steps: Array<stepInterface>;
}