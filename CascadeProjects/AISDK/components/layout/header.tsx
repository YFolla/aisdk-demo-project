/**
 * @fileoverview Application header with navigation and theme controls
 * @description Contains mode selector, provider selector, and theme toggle
 */

'use client'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme/theme-provider'
import { useChatStore, useDeveloperView } from '@/stores/chat-store'
import { Moon, Sun, Monitor, Code } from 'lucide-react'

/**
 * Application header component with theme toggle
 * @description Provides theme switching and basic navigation
 * @returns JSX element containing header with controls
 */
export function Header() {
  const { theme, setTheme } = useTheme()
  const showDeveloperView = useDeveloperView()
  const toggleDeveloperView = useChatStore((state) => state.toggleDeveloperView)

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">AI Lab</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={showDeveloperView ? "default" : "ghost"}
            size="sm"
            onClick={toggleDeveloperView}
            className="h-8 w-8 px-0"
            title="Toggle Developer View"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-8 w-8 px-0"
            title={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
          >
            {getThemeIcon()}
          </Button>
        </div>
      </div>
    </header>
  )
}
