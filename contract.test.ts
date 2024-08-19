import { test } from "vitest";
import { FSWorld, assertAccount, e } from "xsuite";

test("BB 🔴 SC A (shard 0, non-payable) calls SC B (shard 1) with async v1. SC B sends back 1 EGLD and 1 ESDT", async () => {
	using world = await FSWorld.start();

	const wallet = await createWallet(world);
	const contractA = await createContractA(world, 0);
	const contractB = await createContractB(world, 1);

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

	await world.generateBlocks(3);

	assertAccount(await contractB.getAccount(), {
		balance: 1, // The EGLD was reimbursed
	});
});

test("🔴 SC A (shard 0, non-payable) calls SC B (shard 1) with async v2. SC B sends back 1 EGLD and 1 ESDT", async () => {
	using world = await FSWorld.start();

	const wallet = await createWallet(world);
	const contractA = await createContractA(world, 0);
	const contractB = await createContractB(world, 1);

	await wallet
		.callContract({
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

	// Wait 3 blocks
	await world.generateBlocks(3);

	assertAccount(await contractB.getAccount(), {
		balance: 1, // The EGLD was reimbursed
		kvs: { esdts: [{ id: tokenId, amount: 0 }] },
	});
	assertAccount(await contractA.getAccount(), {
		balance: 0,
		kvs: { esdts: [{ id: tokenId, amount: 1 }] },
	});
});

test("AA BB 🔴 SC A (shard 0, non-payable) calls SC B (shard 1) with async v2. SC B sends back 1 EGLD and 1 ESDT", async () => {
	using world = await FSWorld.start();

	const wallet = await createWallet(world);
	const contractA = await createContractA(world, 0);
	const contractB = await createContractB(world, 1);

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
			"454c524f4e44564d404153594e430a5f3ce7bc581aa8368a4e81df75f67746ea23c90ff3488295718fc486c20d92":
				"0a20000000000000000005000000000200000000000000000000000000000000000012200a5f3ce7bc581aa8368a4e81df75f67746ea23c90ff3488295718fc486c20d92222001000000010000000000000000000000000000000000000000000000000000012a20010000000100000000000000000000000000000000000000000000000000000162732a710a20aedfabd1576087fb80cdc81d667871703185cfeda6f9ec55868d5965704974db18042a200000000000000000050000000003000000000000000000000000000000000001322473656e645f6261636b4030314035343466346232643331333233333334333533364030313880ade20468017001",
		}, // The ESDT was not received (this storage is an uncompleted async v2 operation). Where is it ?
	});

	// Wait 6 blocks
	await world.generateBlocks(6);

	assertAccount(await contractB.getAccount(), {
		balance: 1, // The EGLD was reimbursed
		kvs: { esdts: [{ id: tokenId, amount: 0 }] },
	});
	assertAccount(await contractA.getAccount(), {
		balance: 0,
		kvs: { esdts: [{ id: tokenId, amount: 1 }] }, // The ESDT was received
	});
});

const wasmCodePath = "file:output/contract.wasm";
const egldUnit = 10n ** 18n;
const tokenId = "TOK-123456";

const createWallet = async (world: FSWorld) =>
	world.createWallet({
		balance: egldUnit,
	});
const createContractA = async (world: FSWorld, shard: number) =>
	world.createContract({
		address: { shard },
		code: wasmCodePath,
		codeMetadata: [],
	});

const createContractB = async (world: FSWorld, shard: number) =>
	world.createContract({
		address: { shard },
		code: wasmCodePath,
		codeMetadata: [],
		balance: 1,
		kvs: { esdts: [{ id: tokenId, amount: 1 }] },
	});
