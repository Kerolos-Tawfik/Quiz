<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class coustmMail extends Mailable
{
    use Queueable, SerializesModels;

    public $name;
    public $phone;
    public $correct;
    public $wrong;
    public $percentage;
    public $sections;

    /**
     * Create a new message instance.
     */
    public function __construct($name, $phone, $correct, $wrong, $percentage, $sections)
    {
        $this->name = $name;
        $this->phone = $phone;
        $this->correct = $correct;
        $this->wrong = $wrong;
        $this->percentage = $percentage;
        $this->sections = $sections;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'نتيجة اختبارك في مركز النور الأمثل للتدريب'
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.Mail',
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
