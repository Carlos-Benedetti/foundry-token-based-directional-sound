export default function (value, oldMax, newMin, newMax) {
    return ((value / oldMax) - newMin) / (newMax - newMin)
}