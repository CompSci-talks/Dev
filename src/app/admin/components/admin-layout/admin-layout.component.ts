import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="flex h-screen bg-slate-50">
      <!-- Sidebar -->
      <aside class="w-64 bg-slate-900 text-white flex flex-col">
        <div class="p-6">
          <h1 class="text-xl font-bold tracking-tight">Admin Portal</h1>
          <p class="text-slate-400 text-xs mt-1">CompSci Talks</p>
        </div>
        
        <nav class="flex-1 px-4 py-2 space-y-1">
          <a routerLink="semesters" routerLinkActive="bg-slate-800 text-white" 
             class="flex items-center px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <span class="mr-3">📅</span>
            Semester Manager
          </a>
          <a routerLink="seminars" routerLinkActive="bg-slate-800 text-white"
             class="flex items-center px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <span class="mr-3">🎤</span>
            Seminar Scheduling
          </a>
          <a routerLink="speakers" routerLinkActive="bg-slate-800 text-white"
             class="flex items-center px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <span class="mr-3">👤</span>
            Speaker Manager
          </a>
          <a routerLink="tags" routerLinkActive="bg-slate-800 text-white"
             class="flex items-center px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <span class="mr-3">🏷️</span>
            Tag Manager
          </a>
          <a routerLink="moderation" routerLinkActive="bg-slate-800 text-white"
             class="flex items-center px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <span class="mr-3">💬</span>
            Comment Moderation
          </a>
        </nav>
        
        <div class="p-4 border-t border-slate-800">
          <a routerLink="/" class="text-xs text-slate-400 hover:text-white">← Back to Public Portal</a>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col overflow-hidden">
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 class="text-lg font-semibold text-slate-800 uppercase tracking-wider text-sm">Dashboard</h2>
          <div class="flex items-center space-x-4">
             <span class="text-xs text-slate-500 italic">Logged in as Admin</span>
             <button class="bg-slate-100 p-2 rounded-full text-slate-600 hover:bg-slate-200">👤</button>
          </div>
        </header>
        
        <div class="flex-1 overflow-auto p-8">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class AdminLayoutComponent { }
