export const waterBodySchema = {
    $id: "WaterBody",
    type: "object",
    properties: {
        x_capacity: {
            type: "number",
            exclusiveMinimum: 0,
            errorMessage: {
                exclusiveMinimum: "x_capacity must be a positive number.",
                type: "x_capacity must be a number."
            }
        },
        y_capacity: {
            type: "number",
            exclusiveMinimum: 0,
            errorMessage: {
                exclusiveMinimum: "y_capacity must be a positive number.",
                type: "y_capacity must be a number."
            }
        },
        z_amount_wanted: {
            type: "number",
            exclusiveMinimum: 0,
            errorMessage: {
                exclusiveMinimum: "z_amount_wanted must be a positive number.",
                type: "z_amount_wanted must be a number."
            }
        },
    },
    required: ["x_capacity", "y_capacity", "z_amount_wanted"],
    additionalProperties: false,
    errorMessage: {
        required: {
            x_capacity: "x_capacity is a required field.",
            y_capacity: "y_capacity is a required field.",
            z_amount_wanted: "z_amount_wanted is a required field."
        },
        additionalProperties: "Additional properties are not allowed."
    }
};
