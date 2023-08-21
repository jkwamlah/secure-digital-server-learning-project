import {sha256} from 'ethereum-cryptography/sha256'
import {utf8ToBytes, toHex} from 'ethereum-cryptography/utils'
import {secp256k1 as secp} from "ethereum-cryptography/secp256k1"

export default function signMessage(data, privateKey) {
    const _hashedMessage = toHash(data)
    const _signedMessage = secp.sign(_hashedMessage, privateKey)

    return {
        _signedMessage,
        hashedMessage: _hashedMessage,
        publicKey: toHex(_signedMessage.recoverPublicKey(_hashedMessage).toRawBytes())
    }
}

export function toHash(data) {
    return toHex(sha256(utf8ToBytes(JSON.stringify(data))))
}