package com.axion.remote.network

import java.net.Inet4Address
import java.net.Inet6Address
import java.net.InetAddress
import java.net.NetworkInterface
import java.util.Collections

data class IpAddressInfo(
    val ipv6Global: String?,
    val ipv6LinkLocal: String?,
    val ipv4: String?,
    val interfaceName: String?
) {
    /**
     * Retorna a string formatada prioritária para conexão no RealVNC Viewer.
     * Prioriza IPv6 Global (ex: [2001:db8::1234]:5900).
     */
    fun getFormattedAddress(port: Int): String {
        return when {
            !ipv6Global.isNullOrEmpty() -> "[$ipv6Global]:$port"
            !ipv4.isNullOrEmpty() -> "$ipv4:$port"
            !ipv6LinkLocal.isNullOrEmpty() -> "[$ipv6LinkLocal]:$port"
            else -> "127.0.0.1:$port"
        }
    }

    /**
     * Retorna o endereço IPv6 principal para exibição no card de status
     */
    fun getDisplayIpv6(): String {
        return when {
            !ipv6Global.isNullOrEmpty() -> ipv6Global
            !ipv6LinkLocal.isNullOrEmpty() -> "$ipv6LinkLocal (link-local)"
            else -> "IPv6 não atribuído pela rede"
        }
    }
}

object NetworkManager {

    /**
     * Realiza a varredura das interfaces de rede ativas (Wi-Fi, Celular 4G/5G, Ethernet),
     * detectando e priorizando endereços IPv6 Global Unicast (RFC 3587 / 4291).
     */
    fun getDeviceIpAddresses(): IpAddressInfo {
        var bestIpv6Global: String? = null
        var bestIpv6LinkLocal: String? = null
        var bestIpv4: String? = null
        var selectedInterface: String? = null

        try {
            val interfaces = Collections.list(NetworkInterface.getNetworkInterfaces())

            // Itera pelas interfaces ativas e não-loopback
            for (intf in interfaces) {
                if (!intf.isUp || intf.isLoopback) continue

                val addresses = Collections.list(intf.inetAddresses)
                for (addr in addresses) {
                    if (addr.isLoopbackAddress) continue

                    if (addr is Inet6Address) {
                        val hostAddress = cleanIpv6Address(addr)

                        if (isGlobalUnicast(addr)) {
                            // Encontrou endereço IPv6 Global (GUA - 2000::/3)
                            bestIpv6Global = hostAddress
                            selectedInterface = intf.displayName
                        } else if (addr.isLinkLocalAddress && bestIpv6LinkLocal == null) {
                            // Link-local (fe80::)
                            bestIpv6LinkLocal = hostAddress
                            if (selectedInterface == null) selectedInterface = intf.displayName
                        }
                    } else if (addr is Inet4Address && bestIpv4 == null) {
                        bestIpv4 = addr.hostAddress
                        if (selectedInterface == null) selectedInterface = intf.displayName
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        return IpAddressInfo(
            ipv6Global = bestIpv6Global,
            ipv6LinkLocal = bestIpv6LinkLocal,
            ipv4 = bestIpv4,
            interfaceName = selectedInterface
        )
    }

    /**
     * Verifica se o endereço IPv6 é Global Unicast (inicia com 2000:: até 3fff::)
     * e não é ULA (fc00::/7) nem Link-Local (fe80::/10).
     */
    private fun isGlobalUnicast(addr: Inet6Address): Boolean {
        if (addr.isLinkLocalAddress || addr.isLoopbackAddress || addr.isMulticastAddress) {
            return false
        }
        val bytes = addr.address
        if (bytes.size >= 2) {
            val firstByte = bytes[0].toInt() and 0xFF
            // 2000::/3 abrange 0x20 até 0x3F
            if (firstByte in 0x20..0x3F) {
                return true
            }
        }
        // Fallback para isSiteLocal / isMCSiteLocal / etc.
        return !addr.isLinkLocalAddress && !addr.isAnyLocalAddress
    }

    /**
     * Remove o identificador de interface (%wlan0, %eth0) para compatibilidade com clientes VNC
     */
    private fun cleanIpv6Address(addr: Inet6Address): String {
        var str = addr.hostAddress ?: ""
        val percentIdx = str.indexOf('%')
        if (percentIdx != -1) {
            str = str.substring(0, percentIdx)
        }
        return str
    }
}
