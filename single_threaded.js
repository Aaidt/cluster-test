let count = 1_000_000_000_0

const startTime = Date.now()

let ans = 0
for(let i = 0; i < count; i++){
    ans += i
}

const endTime = Date.now()

console.log(ans)
console.log(`Total time: ${endTime - startTime}`);
