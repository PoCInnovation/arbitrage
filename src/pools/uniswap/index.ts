import {ethers} from "ethers";
import {abi as IUniswapV3PoolABI} from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import {get} from "env-var";
import JSBI from "jsbi";

const env = (key: string, required = true) => get(key).required(required);

interface State {
    liquidity: ethers.BigNumber;
    sqrtPriceX96: number;
    tick: number;
    observationIndex: number;
    observationCardinality: number;
    observationCardinalityNext: number;
    feeProtocol: number;
    unlocked: boolean;
}

const provider = new ethers.providers.JsonRpcProvider(
    "https://mainnet.infura.io/v3/" + env("NODE_ENDPOINT").asString(),
);
const poolAddress = env("POOL_ADDRESS").asString();
const poolContract = new ethers.Contract(
    poolAddress,
    IUniswapV3PoolABI,
    provider
);

async function getPoolData(): Promise<State> {
    const slot = await poolContract.slot0();

    return {
        liquidity: await poolContract.liquidity(),
        sqrtPriceX96: slot[0],
        tick: slot[1],
        observationIndex: slot[2],
        observationCardinality: slot[3],
        observationCardinalityNext: slot[4],
        feeProtocol: slot[5],
        unlocked: slot[6],
    };
}

function getPrice(state: State) {
    const token1Decimals = env("TOKEN_1_DECIMALS").asInt();
    const token2Decimals = env("TOKEN_2_DECIMALS").asInt();
    let multiplier: number = 1;

    for (let i = 0; i < token1Decimals - token2Decimals; i++) {
        multiplier *= 10;
    }
    const res = JSBI
        .divide(
            JSBI.multiply(
                JSBI.BigInt(multiplier),
                JSBI.BigInt(state.sqrtPriceX96 * state.sqrtPriceX96)),
            JSBI.exponentiate(
                JSBI.BigInt(2),
                JSBI.BigInt(192)));
    console.log(res.toString());
}

(function run() {
    getPoolData()
        .then((s) => {
            getPrice(s);
        })
        .catch((e) => {
            console.error("ERROR: " + e);
        });
})();