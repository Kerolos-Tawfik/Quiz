<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EmailVerificationCode extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public $code , public $name) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Email Verification Code'
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.verification-code',
        );
        
    }

    public function attachments(): array
    {
        return [];
    }
}
