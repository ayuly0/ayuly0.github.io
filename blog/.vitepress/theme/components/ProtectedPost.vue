<script setup lang="ts">
/**
 * ProtectedPost Component
 * 
 * Decrypts and displays password-protected content.
 * Expects Base64-packed encrypted data: salt(32 hex) + iv(32 hex) + ciphertext(hex)
 */
import { ref, computed } from 'vue';
import CryptoJS from 'crypto-js';

const MAGIC_PREFIX = 'PROTECTED_CONTENT_V1:';
const PBKDF2_ITERATIONS = 100000;

const props = defineProps<{
    data: string;
}>();

const password = ref('');
const decryptedContent = ref('');
const error = ref('');
const isUnlocked = ref(false);
const isLoading = ref(false);

const decrypt = async () => {
    if (!password.value.trim()) {
        error.value = 'Please enter the password.';
        return;
    }

    isLoading.value = true;
    error.value = '';

    // Use setTimeout to allow UI to update before heavy crypto operation
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
        // Decode Base64 to hex (browser-compatible)
        const binaryStr = atob(props.data);
        let packedHex = '';
        for (let i = 0; i < binaryStr.length; i++) {
            packedHex += binaryStr.charCodeAt(i).toString(16).padStart(2, '0');
        }
        
        // Unpack: salt(32) + iv(32) + ciphertext(rest)
        const salt = CryptoJS.enc.Hex.parse(packedHex.slice(0, 32));
        const iv = CryptoJS.enc.Hex.parse(packedHex.slice(32, 64));
        const ciphertext = CryptoJS.enc.Hex.parse(packedHex.slice(64));

        // Derive key
        const key = CryptoJS.PBKDF2(password.value, salt, {
            keySize: 256 / 32,
            iterations: PBKDF2_ITERATIONS,
            hasher: CryptoJS.algo.SHA256
        });

        // Decrypt
        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext } as CryptoJS.lib.CipherParams,
            key,
            { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
        );

        const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

        if (!plaintext || !plaintext.startsWith(MAGIC_PREFIX)) {
            throw new Error('Decryption failed');
        }

        decryptedContent.value = plaintext.slice(MAGIC_PREFIX.length);
        isUnlocked.value = true;
    } catch (e) {
        error.value = 'Incorrect password. Please try again.';
        console.error('Decryption error:', e);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="protected-container">
        <Transition name="fade" mode="out-in">
            <div v-if="!isUnlocked" class="lock-screen" key="lock">
                <div class="lock-icon">🔒</div>
                <h3>Protected Content</h3>
                <p class="hint">Enter the password to unlock.</p>
                
                <form @submit.prevent="decrypt" class="unlock-form">
                    <input 
                        v-model="password"
                        type="password"
                        placeholder="Password..."
                        class="password-input"
                        :disabled="isLoading"
                    />
                    <button 
                        type="submit" 
                        class="unlock-btn"
                        :disabled="isLoading"
                    >
                        {{ isLoading ? 'Decrypting...' : 'Unlock' }}
                    </button>
                </form>
                
                <p v-if="error" class="error">{{ error }}</p>
            </div>
            
            <div v-else class="content vp-doc" key="content" v-html="decryptedContent" />
        </Transition>
    </div>
</template>

<style scoped>
.protected-container {
    margin: 1.5rem 0;
}

.lock-screen {
    text-align: center;
    padding: 2rem;
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
}

.lock-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

h3 {
    margin: 0 0 0.5rem;
    color: var(--vp-c-text-1);
}

.hint {
    color: var(--vp-c-text-2);
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
}

.unlock-form {
    display: flex;
    gap: 0.5rem;
    max-width: 400px;
    margin: 0 auto;
}

.password-input {
    flex: 1;
    padding: 0.6rem 1rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
    background: var(--vp-c-bg);
    color: var(--vp-c-text-1);
    font-family: inherit;
}

.password-input:focus {
    outline: none;
    border-color: var(--vp-c-brand-1);
}

.unlock-btn {
    padding: 0.6rem 1.2rem;
    background: var(--vp-c-brand-1);
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s;
}

.unlock-btn:hover:not(:disabled) {
    opacity: 0.9;
}

.unlock-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.error {
    color: var(--vp-c-danger-1);
    font-size: 0.9rem;
    margin-top: 1rem;
}

.content {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
