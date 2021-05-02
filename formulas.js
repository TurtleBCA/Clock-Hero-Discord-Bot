exports.power = function power(level) {
    return Math.pow(level, 1.5);
}

exports.health = function health(level) {
    return Math.pow(level, Math.log(9981) / Math.log(100)) + 19;
}

exports.damage = function damage(attack, defense) {
    return Math.ceil((attack * attack) / (attack + defense));
}

exports.average = (nums) => {
    let result = 0;
    nums.forEach(num => {result += num});
    return result / nums.length;
}

exports.standardDeviation = (nums) => {
    let result = 0;
    let average = exports.average(nums);
    nums.forEach(num => {result += (num - average) * (num - average)});
    return Math.sqrt(result / nums.length);
}

exports.logistic = (x, midpoint = 0, hi = 1, growthRate = 1) => {
    return hi / (1 + Math.exp(-growthRate * (x - midpoint)));
}

exports.previousPoints = (level) => {
    return (level - 1) * (10 + 10 + level - 2) / 2;
}