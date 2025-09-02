<?php

namespace App\Mail\Shop;

use App\Models\ShopModel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MailUpdateStatus extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(protected ShopModel $shop)
    {
        $this->onQueue('mail');
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = match ($this->shop->status) {
            ShopModel::STATUS_SUSPENDED => 'Your shop has been suspended',
            ShopModel::STATUS_REJECTED => 'Your shop registration has been rejected',
            ShopModel::STATUS_ACTIVE => 'Your shop registration has been approved',
        };

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $view = match ($this->shop->status) {
            ShopModel::STATUS_SUSPENDED => 'mails.shop.suspended',
            ShopModel::STATUS_REJECTED => 'mails.shop.rejected',
            ShopModel::STATUS_ACTIVE => 'mails.shop.approved',
        };
        return new Content(
            view: $view,
            with: [
                'shop' => $this->shop,
                'dashboardUrl' => route("redirect.link", [
                    "url" => "shopera://"
                ]),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
