#![no_std]

multiversx_sc::imports!();

#[multiversx_sc::contract]
pub trait Contract {
    #[init]
    fn init(&self) {}

    #[endpoint]
    fn send_back_from_sc_async_v1(
        &self,
        address: ManagedAddress,
        egld_amount: BigUint,
        token_id: TokenIdentifier,
        token_amount: BigUint,
    ) {
        self.own_proxy(address)
            .send_back(egld_amount, token_id, token_amount)
            .async_call_and_exit()
    }

    #[endpoint]
    fn send_back_from_sc_async_v2(
        &self,
        address: ManagedAddress,
        egld_amount: BigUint,
        token_id: TokenIdentifier,
        token_amount: BigUint,
        gas: u64,
    ) {
        self.tx()
            .to(address)
            .typed(ContractProxy)
            .send_back(egld_amount, token_id, token_amount)
            .with_gas_limit(gas)
            .register_promise()
    }

    #[endpoint]
    fn send_back(&self, egld_amount: BigUint, token_id: TokenIdentifier, token_amount: BigUint) {
        let caller = self.blockchain().get_caller();
        self.send().direct_egld(&caller, &egld_amount);
        self.send()
            .direct_esdt(&caller, &token_id, 0, &token_amount);
    }

    #[proxy]
    fn own_proxy(&self, address: ManagedAddress) -> self::Proxy<Self::Api>;
}

////////////////////////////////////////////////////
////////////////////// Proxy ///////////////////////
////////////////////////////////////////////////////

use multiversx_sc::proxy_imports::*;

pub struct ContractProxy;

impl<Env, From, To, Gas> TxProxyTrait<Env, From, To, Gas> for ContractProxy
where
    Env: TxEnv,
    From: TxFrom<Env>,
    To: TxTo<Env>,
    Gas: TxGas<Env>,
{
    type TxProxyMethods = ContractProxyMethods<Env, From, To, Gas>;

    fn proxy_methods(self, tx: Tx<Env, From, To, (), Gas, (), ()>) -> Self::TxProxyMethods {
        ContractProxyMethods { wrapped_tx: tx }
    }
}

pub struct ContractProxyMethods<Env, From, To, Gas>
where
    Env: TxEnv,
    From: TxFrom<Env>,
    To: TxTo<Env>,
    Gas: TxGas<Env>,
{
    wrapped_tx: Tx<Env, From, To, (), Gas, (), ()>,
}

#[rustfmt::skip]
impl<Env, From, To, Gas> ContractProxyMethods<Env, From, To, Gas>
where
    Env: TxEnv,
    Env::Api: VMApi,
    From: TxFrom<Env>,
    To: TxTo<Env>,
    Gas: TxGas<Env>,
{
    pub fn send_back<
        Arg0: ProxyArg<BigUint<Env::Api>>,
        Arg1: ProxyArg<TokenIdentifier<Env::Api>>,
        Arg2: ProxyArg<BigUint<Env::Api>>,
    >(
        self,
        egld_amount: Arg0,
        token_id: Arg1,
        token_amount: Arg2,
    ) -> TxTypedCall<Env, From, To, NotPayable, Gas, ()> {
        self.wrapped_tx
            .payment(NotPayable)
            .raw_call("send_back")
            .argument(&egld_amount)
            .argument(&token_id)
            .argument(&token_amount)
            .original_result()
    }
}
