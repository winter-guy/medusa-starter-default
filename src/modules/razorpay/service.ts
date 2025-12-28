import { AbstractPaymentProvider, PaymentSessionStatus, MedusaError } from "@medusajs/utils"
import {
    InitiatePaymentInput,
    InitiatePaymentOutput,
    AuthorizePaymentInput,
    AuthorizePaymentOutput,
    CancelPaymentInput,
    CancelPaymentOutput,
    CapturePaymentInput,
    CapturePaymentOutput,
    DeletePaymentInput,
    DeletePaymentOutput,
    RefundPaymentInput,
    RefundPaymentOutput,
    RetrievePaymentInput,
    RetrievePaymentOutput,
    UpdatePaymentInput,
    UpdatePaymentOutput,
    GetPaymentStatusInput,
    GetPaymentStatusOutput,
    ProviderWebhookPayload,
    WebhookActionResult
} from "@medusajs/types"
// import { LogicError } from "@medusajs/framework/utils" 
// LogicError/MedusaError handling
import Razorpay from "razorpay"
import crypto from "crypto"

type RazorpayOptions = {
    key_id: string
    key_secret: string
}

export default class RazorpayProvider extends AbstractPaymentProvider<RazorpayOptions> {
    static identifier = "razorpay"
    protected razorpay_: Razorpay
    protected options_: RazorpayOptions

    constructor(container, options: RazorpayOptions) {
        super(container, options)
        this.options_ = options
        this.razorpay_ = new Razorpay({
            key_id: options.key_id,
            key_secret: options.key_secret,
        })
    }

    async initiatePayment(
        input: InitiatePaymentInput
    ): Promise<InitiatePaymentOutput> {
        const { currency_code, amount } = input

        if (!amount || !currency_code) {
            throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                "Amount and currency_code are required for Razorpay payment initiation"
            )
        }

        try {
            const order = await this.razorpay_.orders.create({
                amount: Math.round(amount as number),
                currency: currency_code.toUpperCase(),
                receipt: "receipt_" + Date.now(),
            })

            return {
                id: order.id,
                data: {
                    ...order,
                },
            }
        } catch (e) {
            throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, "Failed to create Razorpay Order", e)
        }
    }

    async authorizePayment(
        input: AuthorizePaymentInput
    ): Promise<AuthorizePaymentOutput> {
        const paymentSessionData = input.data || {}
        const { status } = await this.getPaymentStatus(input as unknown as GetPaymentStatusInput)

        return {
            status,
            data: paymentSessionData,
        }
    }

    async cancelPayment(
        input: CancelPaymentInput
    ): Promise<CancelPaymentOutput> {
        return {
            data: input.data || {}
        }
    }

    async capturePayment(
        input: CapturePaymentInput
    ): Promise<CapturePaymentOutput> {
        return {
            data: input.data || {}
        }
    }

    async deletePayment(
        input: DeletePaymentInput
    ): Promise<DeletePaymentOutput> {
        return {
            data: input.data || {}
        }
    }

    async getPaymentStatus(
        input: GetPaymentStatusInput
    ): Promise<GetPaymentStatusOutput> {
        const { data } = input
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
        } = (data || {}) as Record<string, string>

        if (razorpay_payment_id && razorpay_order_id && razorpay_signature) {
            const shasum = crypto.createHmac("sha256", this.options_.key_secret)
            shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`)
            const digest = shasum.digest("hex")

            if (digest === razorpay_signature) {
                return { status: PaymentSessionStatus.AUTHORIZED }
            }
            return { status: PaymentSessionStatus.ERROR }
        }

        return { status: PaymentSessionStatus.PENDING }
    }

    async refundPayment(
        input: RefundPaymentInput
    ): Promise<RefundPaymentOutput> {
        const paymentSessionData = (input.data || {}) as Record<string, any>
        const refundAmount = input.amount
        const paymentId = paymentSessionData.razorpay_payment_id as string

        if (!paymentId) {
            throw new MedusaError(MedusaError.Types.INVALID_DATA, "Cannot refund payment without payment ID")
        }

        try {
            const refund = await this.razorpay_.payments.refund(paymentId, {
                amount: refundAmount as number
            })
            return {
                data: {
                    ...paymentSessionData,
                    refund_id: refund.id
                }
            }
        } catch (e) {
            throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, "Razorpay refund failed", e)
        }
    }

    async retrievePayment(
        input: RetrievePaymentInput
    ): Promise<RetrievePaymentOutput> {
        return {
            data: input.data || {}
        }
    }

    async updatePayment(
        input: UpdatePaymentInput
    ): Promise<UpdatePaymentOutput> {
        const result = await this.initiatePayment(input)
        return {
            data: result.data || {}
        }
    }

    async getWebhookActionAndData(
        data: ProviderWebhookPayload["payload"]
    ): Promise<WebhookActionResult> {
        return {
            action: "not_supported",
        }
    }
}
