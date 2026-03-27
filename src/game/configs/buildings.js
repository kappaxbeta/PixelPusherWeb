export const gymParts = [
    {
        id: "gymDown",
        tiles: [
            2795, 2796, 2797, 2798, 2799, 2800, 2801, 2827, 2828, 2829, 2830,
            2831, 2832, 2833, 2859, 2860, 2861, 2862, 2863, 2864, 2865,
        ],
        width: 7,
        collisions: [
            { x: 0, y: 0, width: 76, height: 44, isSensor: false },
            {
                x: 274 - 177,
                y: 1393 - 1393,
                width: 13,
                height: 43,
                isSensor: false,
            },
            {
                x: 254 - 177,
                y: 1391 - 1393,
                width: 20,
                height: 17,
                isSensor: false,
            },
            {
                x: 254 - 177,
                y: 1413 - 1393,
                width: 19,
                height: 24,
                isSensor: true,
                id: "gym_entrance",
            },
        ],
    },
    {
        id: "gymUp",
        tiles: [
            2922, 2923, 2924, 2925, 2926, 2927, 2928, 2954, 2955, 2956, 2957,
            2958, 2959, 2960, 2986, 2987, 2988, 2989, 2990, 2991, 2992, 3018,
            3019, 3020, 3021, 3022, 3023, 3024, 3050, 3051, 3052, 3053, 3054,
            3055, 3056, 3082, 3083, 3084, 3085, 3086, 3087, 3088, 3114, 3115,
            3116, 3117, 3118, 3119, 3120,
        ],
        width: 7,
        collisions: [{ x: 5, y: 20, width: 108, height: 97, isSensor: false }],
    },
];

export const buildingsparts = [
    ...gymParts,
    // Roof Top Row
    {
        id: "redRoofEdgeLeftTop",
        tiles: [2752, 2784, 2816, 2848, 2880, 2912, 2944, 2976, 3008, 3040],
        width: 1,
        collisions: [{ x: 0, y: 0, width: 16, height: 159, isSensor: false }],
    },
    {
        id: "redRoofEdgeMiddleTop",
        tiles: [
            2753, 2754, 2755, 2756, 2757, 2785, 2786, 2787, 2788, 2789, 2817,
            2818, 2819, 2820, 2821, 2849, 2850, 2851, 2852, 2853, 2881, 2882,
            2883, 2884, 2885, 2913, 2914, 2915, 2916, 2917, 2945, 2946, 2947,
            2948, 2949, 2977, 2978, 2979, 2980, 2981, 3009, 3010, 3011, 3012,
            3013, 3041, 3042, 3043, 3044, 3045,
        ],
        width: 5,
        collisions: [
            { x: 0, y: 0, width: 79, height: 18, isSensor: false },
            { x: 0, y: 94, width: 81, height: 64, isSensor: false },
        ],
    },
    {
        id: "redRoofEdgeRightTop",
        tiles: [2752, 2784, 2816, 2848, 2880, 2912, 2944, 2976, 3008, 3040],
        flipX: true,
        width: 1,
        collisions: [{ x: 0, y: 0, width: 16, height: 159, isSensor: false }],
    },
    // Middle Building Row
    {
        id: "redBuildingMiddleEdgeLeft",
        tiles: [3104, 3136, 3168],
        width: 1,
        collisions: [{ x: 0, y: 0, width: 16, height: 50, isSensor: false }],
    },
    {
        id: "redBuildingMiddleEdgeMiddle",
        tiles: [
            3105, 3106, 3107, 3108, 3109, 3137, 3138, 3139, 3140, 3141, 3169,
            3170, 3171, 3172, 3173,
        ],
        width: 5,
        collisions: [{ x: 0, y: 0, width: 82, height: 49, isSensor: false }],
    },
    {
        id: "redBuildingMiddleEdgeRight",
        tiles: [3104, 3136, 3168],
        flipX: true,
        width: 1,
        collisions: [{ x: 0, y: 0, width: 16, height: 50, isSensor: false }],
    },
    // Ground Building Row
    {
        id: "redBuildingGroundEdgeLeft",
        tiles: [3232, 3264, 3296, 3328],
        width: 1,
        collisions: [{ x: 0, y: 0, width: 17, height: 65, isSensor: false }],
    },
    {
        id: "redBuildingGroundEdgeMiddle",
        tiles: [
            3233, 3234, 3235, 3236, 3237, 3265, 3266, 3267, 3268, 3269, 3297,
            3298, 3299, 3300, 3301, 3329, 3330, 3331, 3332, 3333,
        ],
        width: 5,
        collisions: [
            { x: 0, y: 0, width: 18, height: 64, isSensor: false },
            { x: 62, y: 0, width: 21, height: 59, isSensor: false },
            { x: 32, y: 0, width: 9, height: 6, isSensor: false },
            { x: 16, y: 0, width: 43, height: 21, isSensor: false },
            {
                x: 16,
                y: 16,
                width: 48,
                height: 48,
                id: "main_entrance",
                isSensor: true,
            },
        ],
    },
    {
        id: "redBuildingGroundEdgeRight",
        tiles: [3232, 3264, 3296, 3328],
        flipX: true,
        width: 1,
        collisions: [{ x: 0, y: 0, width: 17, height: 65, isSensor: false }],
    },
];