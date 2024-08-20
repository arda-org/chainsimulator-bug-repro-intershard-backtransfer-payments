import { test } from "vitest";
import {
	type FSContract,
	type FSWallet,
	FSWorld,
	assertAccount,
	e,
} from "xsuite";

test("SC A calls SC B, different shards, async v1. SC B sends back EGLD", async () => {
	using world = await FSWorld.start();

	const { wallet, contractA, contractB } = await createAccounts(world);

	await wallet.callContract({
		callee: contractA,
		funcName: "send_back_from_sc_async_v1",
		funcArgs: [
			e.Addr(contractB),
			e.List(e.Tuple(e.Str("EGLD"), e.U64(0), e.U(1))),
		],
		gasLimit: 100_000_000,
	});

	assertAccount(await contractB.getAccount(), {
		balance: 0,
	});
	assertAccount(await contractA.getAccount(), {
		balance: 1,
	});
});

test("SC A calls SC B, different shards, async v1. SC B sends back FFT", async () => {
	using world = await FSWorld.start();

	const { wallet, contractA, contractB } = await createAccounts(world);

	await wallet.callContract({
		callee: contractA,
		funcName: "send_back_from_sc_async_v1",
		funcArgs: [
			e.Addr(contractB),
			e.List(e.Tuple(e.Str(tokenId), e.U64(0), e.U(1))),
		],
		gasLimit: 100_000_000,
	});

	assertAccount(await contractB.getAccount(), {
		kvs: { esdts: [{ id: tokenId, amount: 0 }] },
	});
	assertAccount(await contractA.getAccount(), {
		kvs: { esdts: [{ id: tokenId, amount: 1 }] },
	});
});

test("🔴 SC A calls SC B, different shards, async v1. SC B sends back EGLD+FFT", async () => {
	using world = await FSWorld.start();

	const { wallet, contractA, contractB } = await createAccounts(world);

	await wallet
		.callContract({
			callee: contractA,
			funcName: "send_back_from_sc_async_v1",
			funcArgs: [
				e.Addr(contractB),
				e.List(
					e.Tuple(e.Str("EGLD"), e.U64(0), e.U(1)),
					e.Tuple(e.Str(tokenId), e.U64(0), e.U(1)),
				),
			],
			gasLimit: 100_000_000,
		})
		.assertFail({
			code: "returnMessage",
			message: "sending value to non payable contract",
		});

	assertAccount(await contractB.getAccount(), {
		balance: 1,
		kvs: { esdts: [{ id: tokenId, amount: 0 }] },
	});
	assertAccount(await contractA.getAccount(), {
		balance: 0,
		kvs: { esdts: [{ id: tokenId, amount: 1 }] },
	});
});

test("🔴 SC A calls SC B, different shards, async v1. SC B sends back FFT+EGLD", async () => {
	using world = await FSWorld.start();

	const { wallet, contractA, contractB } = await createAccounts(world);

	await wallet
		.callContract({
			callee: contractA,
			funcName: "send_back_from_sc_async_v1",
			funcArgs: [
				e.Addr(contractB),
				e.List(
					e.Tuple(e.Str(tokenId), e.U64(0), e.U(1)),
					e.Tuple(e.Str("EGLD"), e.U64(0), e.U(1)),
				),
			],
			gasLimit: 100_000_000,
		})
		.assertFail({
			code: "returnMessage",
			message: "sending value to non payable contract",
		});

	assertAccount(await contractB.getAccount(), {
		balance: 0,
		kvs: { esdts: [{ id: tokenId, amount: 1 }] },
	});
	assertAccount(await contractA.getAccount(), {
		balance: 1,
		kvs: { esdts: [{ id: tokenId, amount: 0 }] },
	});
});

test("SC A calls SC B, different shards, async v2. SC B sends back EGLD", async () => {
	using world = await FSWorld.start();

	const { wallet, contractA, contractB } = await createAccounts(world);

	await wallet.callContract({
		callee: contractA,
		funcName: "send_back_from_sc_async_v2",
		funcArgs: [
			e.Addr(contractB),
			e.List(e.Tuple(e.Str("EGLD"), e.U64(0), e.U(1))),
			e.U64(10_000_000),
		],
		gasLimit: 100_000_000,
	});

	assertAccount(await contractB.getAccount(), {
		balance: 0,
	});
	assertAccount(await contractA.getAccount(), {
		balance: 1,
	});
});

test("SC A calls SC B, different shards, async v2. SC B sends back FFT", async () => {
	using world = await FSWorld.start();

	const { wallet, contractA, contractB } = await createAccounts(world);

	await wallet.callContract({
		callee: contractA,
		funcName: "send_back_from_sc_async_v2",
		funcArgs: [
			e.Addr(contractB),
			e.List(e.Tuple(e.Str(tokenId), e.U64(0), e.U(1))),
			e.U64(10_000_000),
		],
		gasLimit: 100_000_000,
	});

	assertAccount(await contractB.getAccount(), {
		kvs: { esdts: [{ id: tokenId, amount: 0 }] },
	});
	assertAccount(await contractA.getAccount(), {
		kvs: { esdts: [{ id: tokenId, amount: 1 }] },
	});
});

test("🔴 SC A calls SC B, different shards, async v2. SC B sends back EGLD+FFT", async () => {
	using world = await FSWorld.start();

	const { wallet, contractA, contractB } = await createAccounts(world);

	await wallet
		.callContract({
			callee: contractA,
			funcName: "send_back_from_sc_async_v2",
			funcArgs: [
				e.Addr(contractB),
				e.List(
					e.Tuple(e.Str("EGLD"), e.U64(0), e.U(1)),
					e.Tuple(e.Str(tokenId), e.U64(0), e.U(1)),
				),
				e.U64(10_000_000),
			],
			gasLimit: 100_000_000,
		})
		.assertFail({
			code: "returnMessage",
			message: "sending value to non payable contract",
		});

	assertAccount(await contractB.getAccount(), {
		balance: 1,
		kvs: { esdts: [{ id: tokenId, amount: 0 }] },
	});
	assertAccount(await contractA.getAccount(), {
		balance: 0,
		kvs: { esdts: [{ id: tokenId, amount: 1 }] },
	});
});

test("🔴 SC A calls SC B, different shards, async v2. SC B sends back FFT+EGLD", async () => {
	using world = await FSWorld.start();

	const { wallet, contractA, contractB } = await createAccounts(world);

	await wallet
		.callContract({
			callee: contractA,
			funcName: "send_back_from_sc_async_v2",
			funcArgs: [
				e.Addr(contractB),
				e.List(
					e.Tuple(e.Str(tokenId), e.U64(0), e.U(1)),
					e.Tuple(e.Str("EGLD"), e.U64(0), e.U(1)),
				),
				e.U64(10_000_000),
			],
			gasLimit: 100_000_000,
		})
		.assertFail({
			code: "returnMessage",
			message: "sending value to non payable contract",
		});

	assertAccount(await contractB.getAccount(), {
		balance: 0,
		kvs: { esdts: [{ id: tokenId, amount: 1 }] },
	});
	assertAccount(await contractA.getAccount(), {
		balance: 1,
		kvs: { esdts: [{ id: tokenId, amount: 0 }] },
	});
});

const wasmCodePath = "file:output/contract.wasm";
const egldUnit = 10n ** 18n;
const tokenId = "TOK-123456";

const createAccounts = async (
	world: FSWorld,
): Promise<{
	wallet: FSWallet;
	contractA: FSContract;
	contractB: FSContract;
}> => {
	const wallet = await world.createWallet({
		balance: egldUnit,
	});
	const contractA = await world.createContract({
		address: { shard: 0 },
		code: wasmCodePath,
		codeMetadata: [],
	});
	const contractB = await world.createContract({
		address: { shard: 1 },
		code: wasmCodePath,
		codeMetadata: [],
		balance: 1,
		kvs: { esdts: [{ id: tokenId, amount: 1 }] },
	});
	return { wallet, contractA, contractB };
};
