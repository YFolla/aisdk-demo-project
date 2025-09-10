/**
 * @fileoverview Main page component displaying the chat interface
 * @description Entry point for the AI Lab application with chat functionality
 */

import { SimpleChat } from '@/components/chat/simple-chat'

/**
 * Home page component with chat interface
 * @description Main application page containing the chat interface
 * @returns JSX element containing the chat application
 */
export default function Home() {
  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <SimpleChat />
    </div>
  )
}