import { EmailPreview } from '../email-preview';

export default function EmailPreviewExample() {
  return (
    <div className="p-4 max-w-2xl">
      <EmailPreview
        id="1"
        from="customer@example.com"
        subject="Question about product availability"
        message="Hi, I was wondering if the wireless headphones are still in stock? I'd like to order 5 units for my team."
        isRead={false}
        receivedAt="2 hours ago"
        onClick={() => console.log('Email clicked')}
      />
    </div>
  );
}
