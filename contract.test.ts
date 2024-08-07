import { test } from "vitest";
import { FSWorld, assertAccount, e } from "xsuite";

test("SC A (shard 0, non-payable) calls SC B (shard 0) with async v1. SC B sends back 1 EGLD and 1 ESDT", async () => {
	using world = await FSWorld.start();

	const wallet = await world.createWallet({
		balance: egldUnit,
	});
	const [contractA, contractB] = await world.createContracts([
		{
			address: { shard: 0 },
			code: `file:${wasmCodePath}`,
			codeMetadata: [],
		},
		{
			address: { shard: 0 },
			code: `file:${wasmCodePath}`,
			codeMetadata: [],
			balance: 1,
			kvs: { esdts: [{ id: tokenId, amount: 1 }] },
		},
	]);

	await wallet.callContract({
		callee: contractA,
		funcName: "send_back_from_sc_async_v1",
		funcArgs: [
			e.Addr(contractB),
			e.U(1), // EGLD amount
			e.Str(tokenId),
			e.U(1), // ESDT amount
		],
		gasLimit: 100_000_000,
	});

	assertAccount(await contractB.getAccount(), {
		balance: 0, // The EGLD was sent
		kvs: { esdts: [{ id: tokenId, amount: 0 }] }, // The ESDT was sent
	});
	assertAccount(await contractA.getAccount(), {
		balance: 1, // The EGLD was received
		kvs: { esdts: [{ id: tokenId, amount: 1 }] }, // The ESDT was received
	});
});

test("SC A (shard 0, non-payable) calls SC B (shard 0) with async v2. SC B sends back 1 EGLD and 1 ESDT", async () => {
	using world = await FSWorld.start();

	const wallet = await world.createWallet({
		balance: egldUnit,
	});
	const [contractA, contractB] = await world.createContracts([
		{
			address: { shard: 0 },
			code: `file:${wasmCodePath}`,
			codeMetadata: [],
		},
		{
			address: { shard: 0 },
			code: `file:${wasmCodePath}`,
			codeMetadata: [],
			balance: 1,
			kvs: { esdts: [{ id: tokenId, amount: 1 }] },
		},
	]);

	await wallet.callContract({
		callee: contractA,
		funcName: "send_back_from_sc_async_v2",
		funcArgs: [
			e.Addr(contractB),
			e.U(1), // EGLD amount
			e.Str(tokenId),
			e.U(1), // ESDT amount
			e.U64(10_000_000), // Gas limit for async v2
		],
		gasLimit: 100_000_000,
	});

	assertAccount(await contractB.getAccount(), {
		balance: 0, // The EGLD was sent
		kvs: { esdts: [{ id: tokenId, amount: 0 }] }, // The ESDT was sent
	});
	assertAccount(await contractA.getAccount(), {
		balance: 1, // The EGLD was received
		kvs: { esdts: [{ id: tokenId, amount: 1 }] }, // The ESDT was received
	});
});

test("🔴 SC A (shard 0, non-payable) calls SC B (shard 1) with async v1. SC B sends back 1 EGLD and 1 ESDT", async () => {
	using world = await FSWorld.start();

	const wallet = await world.createWallet({
		balance: egldUnit,
	});
	const [contractA, contractB] = await world.createContracts([
		{
			address: { shard: 0 },
			code: `file:${wasmCodePath}`,
			codeMetadata: [],
		},
		{
			address: { shard: 1 },
			code: `file:${wasmCodePath}`,
			codeMetadata: [],
			balance: 1,
			kvs: { esdts: [{ id: tokenId, amount: 1 }] },
		},
	]);

	await wallet
		.callContract({
			callee: contractA,
			funcName: "send_back_from_sc_async_v1",
			funcArgs: [
				e.Addr(contractB),
				e.U(1), // EGLD amount
				e.Str(tokenId),
				e.U(1), // ESDT amount
			],
			gasLimit: 100_000_000,
		})
		.assertFail({
			code: "returnMessage",
			message: "sending value to non payable contract",
		});

	assertAccount(await contractB.getAccount(), {
		balance: 0, // The EGLD was sent
		kvs: { esdts: [{ id: tokenId, amount: 0 }] }, // The ESDT was sent
	});
	assertAccount(await contractA.getAccount(), {
		balance: 0, // The EGLD was not received. Where is it ?
		kvs: { esdts: [{ id: tokenId, amount: 1 }] }, // The ESDT was received
	});
});

test("🔴 SC A (shard 0, non-payable) calls SC B (shard 1) with async v2. SC B sends back 1 EGLD and 1 ESDT", async () => {
	using world = await FSWorld.start();

	const wallet = await world.createWallet({
		balance: egldUnit,
	});
	const [contractA, contractB] = await world.createContracts([
		{
			address: { shard: 0 },
			code: `file:${wasmCodePath}`,
			codeMetadata: [],
		},
		{
			address: { shard: 1 },
			code: `file:${wasmCodePath}`,
			codeMetadata: [],
			balance: 1,
			kvs: { esdts: [{ id: tokenId, amount: 1 }] },
		},
	]);

	await wallet.callContract({
		callee: contractA,
		funcName: "send_back_from_sc_async_v2",
		funcArgs: [
			e.Addr(contractB),
			e.U(1), // EGLD amount
			e.Str(tokenId),
			e.U(1), // ESDT amount
			e.U64(10_000_000), // Gas limit for async v2
		],
		gasLimit: 100_000_000,
	});

	assertAccount(await contractB.getAccount(), {
		balance: 0, // The EGLD was sent
		kvs: { esdts: [{ id: tokenId, amount: 0 }] }, // The ESDT was sent
	});
	assertAccount(await contractA.getAccount(), {
		balance: 0, // The EGLD was not received. Where is it ?
		kvs: {
			"454c524f4e44564d404153594e4371421a6c263fd211bf858f5e46cc318fdeb9cf21f4d6036d3f712e889cf13c5f":
				"0a20000000000000000005000000000b000000000000000000000000000000000000122071421a6c263fd211bf858f5e46cc318fdeb9cf21f4d6036d3f712e889cf13c5f2220010000000a00000000000000000000000000000000000000000000000000000a2a20010000000a00000000000000000000000000000000000000000000000000000a62732a710a20d505d16e20bda5d6e135f1e6f6cf5b16844d8008420e79ee51c748277bdffc4d18042a20000000000000000005000000000c000000000000000000000000000000000001322473656e645f6261636b4030314035343466346232643331333233333334333533364030313880ade20468017001",
		}, // The ESDT was not received (this storage is an uncompleted async v2 operation). Where is it ?
	});
});

const wasmCodePath = "output/contract.wasm";
const egldUnit = 10n ** 18n;
const tokenId = "TOK-123456";
