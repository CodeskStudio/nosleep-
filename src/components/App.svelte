'use client'

import { useState, useEffect } from 'react'
import { Moon, Bell, AlertTriangle, Check, Info, Sun } from 'lucide-react'

export default function Component() {
  const [noSleepEnabled, setNoSleepEnabled] = useState(false)
  const [notificationsRequested, setNotificationsRequested] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationsRequested(Notification.permission === 'granted')
    }
    // Check for user's preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true)
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const requestNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setNotificationsRequested(true)
        }
      })
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-8 transition-colors duration-200">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Device Settings</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Moon className={`w-6 h-6 ${noSleepEnabled ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`} />
              <div>
                <h2 className="text-sm font-medium text-gray-900 dark:text-white">NoSleep™</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{noSleepEnabled ? 'Device will stay awake' : 'Device may sleep'}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={noSleepEnabled}
                onChange={() => setNoSleepEnabled(!noSleepEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className={`w-6 h-6 ${notificationsRequested ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`} />
                <div>
                  <h2 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {notificationsRequested ? 'Permission granted' : 'One-time browser permission required'}
                  </p>
                </div>
              </div>
              {notificationsRequested ? (
                <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
              ) : (
                <button 
                  onClick={requestNotifications}
                  className="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200"
                >
                  Request Permission
                </button>
              )}
            </div>
          </div>
        </div>
        
        {notificationsRequested && (
          <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 dark:border-yellow-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400 dark:text-yellow-300" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                  Notification Permission Granted. You can manage or revoke this permission in your browser settings.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 relative">
          <button 
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 flex items-center justify-center space-x-2 transition-colors duration-200"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info className="w-4 h-4" />
            <span>About these settings</span>
          </button>
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs rounded shadow-lg">
              <p>NoSleep prevents your device from going to sleep.<br />Notifications require a one-time browser permission.</p>
            </div>
          )}
        </div>
        
        <footer className="text-center text-xs text-gray-500 dark:text-gray-400">
          © 2024 CodexStudio. All rights reserved.<br />
          Built with Next.js • TailwindCSS
        </footer>
      </div>
    </div>
  )
}