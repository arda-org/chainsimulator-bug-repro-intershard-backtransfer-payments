#![no_std]

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode, ManagedVecItem)]
struct Payment<M: ManagedTypeApi> {
    token_identifier: EgldOrEsdtTokenIdentifier<M>,
    nonce: u64,
    amount: BigUint<M>,
}

#[multiversx_sc::contract]
pub trait Contract {
    #[init]
    fn init(&self) {}

    /// SC A
    #[endpoint]
    fn send_back_from_sc_async_v1(
        &self,
        address: ManagedAddress,
        payments: ManagedVec<Payment<Self::Api>>,
    ) {
        self.tx()
            .to(address)
            .raw_call("send_back")
            .argument(&payments)
            .async_call_and_exit()
    }
    #[endpoint]
    fn send_back_from_sc_async_v2(
        &self,
        address: ManagedAddress,
        payments: ManagedVec<Payment<Self::Api>>,
        gas: u64,
    ) {
        self.tx()
            .to(address)
            .raw_call("send_back")
            .argument(&payments)
            .with_gas_limit(gas)
            .register_promise()
    }

    /// SC B
    #[endpoint]
    fn send_back(&self, payments: ManagedVec<Payment<Self::Api>>) {
        let caller = self.blockchain().get_caller();
        for payment in payments.into_iter() {
            self.send().direct(
                &caller,
                &payment.token_identifier,
                payment.nonce,
                &payment.amount,
            )
        }
    }
}
