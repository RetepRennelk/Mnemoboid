;;; ~/.doom.d/mnemoboid/mnemoboid.v3.el -*- lexical-binding: t; -*-

;; Copyright (C) 2020 Peter Klenner

;; Author: Peter Klenner <peterklenner@gmx.de>
;; URL: https://github.com/mnemoboid/mnemoboid
;; Keywords: org-mode, convenience
;; Package-Requires: ((emacs "26.3") (org "9.3") (elnode "0.9.9.8.7") (mustache "0.24"))

;; This file is NOT part of GNU Emacs.

;; This program is free software; you can redistribute it and/or modify
;; it under the terms of the GNU General Public License as published by
;; the Free Software Foundation; either version 3, or (at your option)
;; any later version.
;;
;; This program is distributed in the hope that it will be useful,
;; but WITHOUT ANY WARRANTY; without even the implied warranty of
;; MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
;; GNU General Public License for more details.
;;
;; You should have received a copy of the GNU General Public License
;; along with GNU Emacs; see the file COPYING.  If not, write to the
;; Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
;; Boston, MA 02110-1301, USA.

;;; Commentary:
;;
;; This library is an attempt at visualising an org-mode outline with the
;; power of Three.js in modern browsers.
;;
;;; Code:

(defvar mnemoboid-port 8910)

(defun mnemoboid-browse ()
  (interactive)
  (let* ((full-filename (buffer-file-name))
         (filename (file-name-nondirectory full-filename))
         (addr (format "http://localhost:%s/mnemoboid/%s" mnemoboid-port filename)))
    (save-buffer)
    (setq mnemoboid-default-directory default-directory)
    (elnode-start 'mnemoboid-root-handler :port mnemoboid-port :host "0.0.0.0")
    (browse-url addr)))

(defun mnemoboid-endpoint (httpcon)
  (let* ((filename (elnode-http-mapping httpcon 1))
         (org-filename (concat mnemoboid-default-directory filename))
         (html (mnemoboid-make-html org-filename)))
    (message org-filename)
    (elnode-send-html httpcon html)))

(defun mnemoboid-file-handler (httpcon)
  (elnode-docroot-for "~/.doom.d/mnemoboid/assets/static"
      with file
      on httpcon
      do
      (elnode-send-file httpcon file)))

(defun mnemoboid-img-handler (httpcon)
  (elnode-docroot-for (concat mnemoboid-default-directory "img")
      with file
      on httpcon
      do
      (elnode-send-file httpcon file)))
;;; The sequence of the routes are important.
;;; Don't arbitrarly change them.
(defvar mnemoboid-routes
  '(("mnemoboid/img/\\(.*\\)" . mnemoboid-img-handler)
    ("mnemoboid/\\(.*\\)" . mnemoboid-endpoint)
    ("/\\(.*\\)" . mnemoboid-file-handler)))

(defun mnemoboid-root-handler (httpcon)
  (elnode-hostpath-dispatcher httpcon mnemoboid-routes))

(defun mnemoboid-template (file context)
  "Return rendered template as string"
  (mustache-render
   (with-temp-buffer
    (insert-file-contents file)
    (buffer-string))
   context))

(defun mnemoboid-make-html (org-filename)
  (let* ((mnemoboid-outline-json (mnemoboid-org-to-json org-filename))
         (context (ht ("mnemoboid_outline_json" mnemoboid-outline-json))))
    (mnemoboid-template "~/.doom.d/mnemoboid/assets/template/index.html" context)))

(defun mnemoboid-org-to-json (org-filename)
  (with-temp-buffer
    (insert-file-contents org-filename)
    (buffer-string)
    (org-export-as 'json)))

(defun mnemoboid-insert-drawer ()
  (interactive)
  (evil-org-open-below 0)
  (org-insert-drawer nil "mnemonic"))

(provide 'mnemoboid)
